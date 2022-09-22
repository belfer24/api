import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { OutlookHelper } from '@/helpers/outlook/outlook';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mails.interface';
import { Mails, MailsDocument } from './schemas/mail.schema';

@Injectable()
export class MailingService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly ContactsCollection: Model<ContactsDocument>,
    @InjectModel(User.name) private readonly UserCollection: Model<UserDocument>,
    @InjectModel(Mails.name) private readonly MailsCollection: Model<MailsDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async Start(params: IMails.Controller.Start.Body) {
    const { mails, csvData, refreshToken } = params;
    console.log(refreshToken);
    
    const user = await this.UserCollection.findOne({ refreshToken }).exec();
    
    await this.ContactsCollection.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('User not found!');

    const { _id: mailingId } = await this.MailsCollection.create({
      mails,
      createdAt: Date.now(),
      userId: user._id,
      isInProcess: true,
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
    
    return this.MailsCollection.findOneAndUpdate({userId: user!._id, isInProcess: true}, {isInProcess: false});
  }

  async Send({ mailingId }: IMails.Controller.Send.Body) {
    const mailing = await this.MailsCollection.findById(mailingId).exec();

    if (!mailing) throw new Error('No mails found for sending!');

    if (mailing.isInProcess) {
      const notSentMails = mailing.mails.filter((mail) => mail.isSent !== true);

      const mail = notSentMails[0];
      
      const user = await this.UserCollection.findById(mailing.userId).exec();
      
      if (!user) throw new Error('User not found!');

      await this._OutlookHelper.connectToGraph(user.refreshToken);
      await this._OutlookHelper.sendMessage({
        subject: mail.subject,
        text: mail.text,
        to: mail.to,
      });
     
      await this.MailsCollection.updateOne({'_id': mailingId ,'mails.to': mail.to}, {'mails.$.isSent': true});

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
        await this.MailsCollection.findOneAndUpdate({_id: mailingId}, {isInProcess: false});
      }
    }

    return;
  }
}
