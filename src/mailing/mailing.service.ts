import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { OutlookHelper } from '@/helpers/outlook/outlook';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mailing.interface';
import { Mailing, MailingDocument } from './schemas/mailing.schema';

@Injectable()
export class MailingService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly ContactsCollection: Model<ContactsDocument>,
    @InjectModel(User.name)
    private readonly UserCollection: Model<UserDocument>,
    @InjectModel(Mailing.name)
    private readonly MailingCollection: Model<MailingDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async Start(params: IMails.Controller.Start.Body) {
    const { mails, csvData, refreshToken } = params;

    const user = await this.UserCollection.findOne({ refreshToken }).exec();

    await this.ContactsCollection.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('User not found!');

    const { _id: mailingId } = await this.MailingCollection.create({
      mails,
      createdAt: Date.now(),
      userId: user._id,
      isInProcess: true,
      sentAt: (Date.now() + ((mails.length - 1) * 10 * 1000)),
    });

    await this._CloudTasks.createCloudTask({
      payload: {
        mailingId,
      },
      delay: 0,
    });

    return { success: true };
  }

  async Cancel(refreshToken: string) {
    const user = await this.UserCollection.findOne({ refreshToken });

    return this.MailingCollection.findOneAndUpdate(
      { userId: user!._id, isInProcess: true },
      { isInProcess: false },
    );
  }

  async Send({ mailingId }: IMails.Controller.Send.Body) {
    const mailing = await this.MailingCollection.findById(mailingId).exec();

    if (!mailing) throw new Error('No mails found for sending!');

    if (mailing.isInProcess) {
      const notSentMails = mailing.mails.filter((mail) => mail.isSent !== true);

      const mail = notSentMails[0];

      const user = await this.UserCollection.findById(mailing.userId).exec();

      if (!user) throw new Error('User not found!');

      // await this._OutlookHelper.connectToGraph(user.refreshToken);
      // await this._OutlookHelper.sendMessage({
      //   subject: mail.subject,
      //   text: mail.text,
      //   to: mail.to,
      // });

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
        await this._CloudTasks.createCloudTask({
          payload: {
            mailingId,
          },
          delay: 10,
        });
      } else {
        await this.MailingCollection.findOneAndUpdate(
          { _id: mailingId },
          { isInProcess: false },
        );
      }
    }

    return;
  }

  async IsUserSending(refreshToken: string) {
    const user = await this.UserCollection.findOne({ refreshToken });
    const mailing = await this.MailingCollection.findOne({
      userId: user!.id,
      isInProcess: true,
    });

    if (!mailing) return {
      isSending: false,
      mailing: null,
    };

    return {
      isSending: true,
      mailing,
    };
  }
}
