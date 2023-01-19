import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mailing.interface';
import { Mailing, MailingDocument } from './schemas/mailing.schema';
import { UTCDate } from '@/utils/UTCDate';
import { OutlookHelper } from '@/helpers/outlook/outlook';

@Injectable()
export class MailingService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly ContactCollection: Model<ContactsDocument>,
    @InjectModel(User.name)
    private readonly UserCollection: Model<UserDocument>,
    @InjectModel(Mailing.name)
    private readonly MailingCollection: Model<MailingDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async Start({ mails, csvData, refreshToken }: IMails.Service.Start.Body) {
    const delay = 180;

    const user = await this.UserCollection.findOne({ refreshToken });

    await this.ContactCollection.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('User not found!');

    const milliseconds = 1000;
    const mailsMustBeSentAt =
      UTCDate.GetDateByUTC() + (mails.length - 1) * delay * milliseconds;

    const mailing = await this.MailingCollection.create({
      mails,
      createdAt: Date.now(),
      userId: user._id,
      isInProcess: true,
      sentAt: mailsMustBeSentAt,
      hasError: false,
    });

    const mailingId = mailing._id;

    await this._CloudTasks.CreateCloudTask({
      payload: {
        mailingId,
      },
      delay: 0,
    });

    return { data: { mailingId, mailing } };
  }

  async Cancel({ refreshToken }: IMails.Service.Cancel.Body) {
    const user = await this.UserCollection.findOne({ refreshToken });
    const updatedCollection = await this.MailingCollection.findOneAndUpdate(
      { userId: user!._id, isInProcess: true },
      { isInProcess: false },
    );

    return { data: { updatedCollection } };
  }

  async Send({ mailingId }: IMails.Service.Send.Body) {
    const mailing = await this.MailingCollection.findById(mailingId);

    if (!mailing) throw new Error('Mailing not found!');

    if (mailing.isInProcess && !mailing.hasError) {
      const delay = 180;
      const notSentMails = mailing.mails.filter((mail) => mail.isSent !== true);

      const mail = notSentMails[0];

      const user = await this.UserCollection.findById(mailing.userId);

      if (!user) throw new Error('User not found!');

      await this._OutlookHelper.ConnectToGraph(user.refreshToken);
      await this._OutlookHelper.SendMessage({
        subject: mail.subject,
        text: mail.text,
        to: mail.to,
      });

      await this.MailingCollection.updateOne(
        { _id: mailingId, 'mails.to': mail.to },
        { 'mails.$.isSent': true, 'mails.$.isInProcess': false },
      );

      await this.UserCollection.findOneAndUpdate(
        { _id: user.id },
        { $inc: { sentMessagesToday: 1 } },
      );

      const isMoreMailsToSentExist = !!notSentMails[1];

      if (isMoreMailsToSentExist) {
        await this.MailingCollection.updateOne(
          { _id: mailingId, 'mails.to': notSentMails[1].to },
          { 'mails.$.isInProcess': true },
        );

        await this._CloudTasks.CreateCloudTask({
          payload: {
            mailingId,
          },
          delay,
        });
      } else {
        await this.MailingCollection.findOneAndUpdate(
          { _id: mailingId },
          { isInProcess: false },
        );
      }
    }
  }

  async GetMailing({ authorization }: IMails.Service.GetMailing.Body) {
    const user = await this.UserCollection.findOne({
      refreshToken: authorization,
    });

    if (user) {
      const mailing = await this.MailingCollection.find({
        userId: user.id,
      })
        .limit(1)
        .sort({ $natural: -1 });

      if (!mailing.length) return {};
               
      return mailing[0];     
    } else {
      throw Error('User not found!');
    }
  }

  async SetError({ mailingId }: IMails.Service.SetError.Body) {
    const mailing = await this.MailingCollection.findOne({
      _id: mailingId,
    });

    if (mailing) await mailing.updateOne({ hasError: true });
  }

  async Retry({ mailingId }: IMails.Service.Retry.Body) {
    const mailing = await this.MailingCollection.findOne({ _id: mailingId });
    if (mailing) {
      mailing.updateOne({ $set: { isRetried: true } });
    } else {
      throw Error('Retry failed, mailing not found');
    }

    await this.Send({ mailingId });

    return mailing;
  }
}
