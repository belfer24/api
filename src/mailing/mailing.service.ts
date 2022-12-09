import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { OutlookHelper } from '@/helpers/outlook/outlook';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mailing.interface';
import { Mailing, MailingDocument } from './schemas/mailing.schema';
import { UTCDate } from '@/utils/UTCDate';

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

  async Start(params: IMails.Service.Start.Body) {
    console.log(params);
    
    const { mails, csvData, refreshToken } = params;
    const delay = 10;

    const user = await this.UserCollection.findOne({ refreshToken });

    await this.ContactCollection.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('User not found!');

    const milliseconds = 1000;
    const mailsMustBeSentAt = UTCDate.GetDateByUTC() + (mails.length - 1) * delay * milliseconds;

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

  async Cancel(params: IMails.Service.Cancel.Body) {
    const { refreshToken } = params;
    const user = await this.UserCollection.findOne({ refreshToken });
    const updatedCollection = await this.MailingCollection.findOneAndUpdate(
      { userId: user!._id, isInProcess: true },
      { isInProcess: false },
    );

    return { data: { updatedCollection } };
  }

  async Send(params: IMails.Service.Send.Body) {
    const { mailingId } = params;
    const mailing = await this.MailingCollection.findById(mailingId);

    if (!mailing) throw new Error('Mailing not found!');

    if (mailing.isInProcess && !mailing.hasError) {
      const delay = 10;
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
        { 'mails.$.isSent': true },
      );

      await this.UserCollection.findOneAndUpdate(
        { _id: user.id },
        { $inc: { sentMessagesToday: 1 } },
      );

      const isMoreMailsToSentExist = !!notSentMails[1];

      if (isMoreMailsToSentExist) {
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

  async GetMailing(params: IMails.Service.GetMailing.Body) {
    const { authorization } = params;
    const user = await this.UserCollection.findOne({ refreshToken: authorization });    

    const mailing = await this.MailingCollection.findOne({
      userId: user!.id,
      isInProcess: true,
    });

    return { data: { mailing } };
  }

  async SetError(params: IMails.Service.SetError.Body) {
    const { mailingId } = params;
    const mailing = await this.MailingCollection.findOne({
      _id: mailingId,
    });

    if (!mailing) throw Error('Mailing not found!');

    await mailing.updateOne({ hasError: true });
  }
}
