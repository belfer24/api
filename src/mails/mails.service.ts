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
    private readonly contactsModel: Model<ContactsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Mails.name) private readonly mailsModel: Model<MailsDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async Start(params: IMails.Controller.Start.Body) {
    const { mails, csvData, refreshToken } = params;
    console.log(refreshToken);
    
    const user = await this.userModel.findOne({ refreshToken }).exec();
    
    await this.contactsModel.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('ERROR');

    const { _id: mailingId } = await this.mailsModel.create({
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
    const user = await this.userModel.findOne({ refreshToken });
    
    return this.mailsModel.findOneAndUpdate({userId: user!._id}, {isInProcess: false});
  }

  async Send({ mailingId }: IMails.Controller.Send.Body) {
    const mailing = await this.mailsModel.findById(mailingId).exec();

    if (!mailing) throw new Error('ERROR');

    if (mailing.isInProcess) {
      const notSentMails = mailing.mails.filter((mail) => mail.isSent !== true);

      const mail = notSentMails[0];
      
      const user = await this.userModel.findById(mailing.userId).exec();
      
      if (!user) throw new Error('ERROR');

      await this._OutlookHelper.connectToGraph(user.refreshToken);
      await this._OutlookHelper.sendMessage({
        subject: mail.subject,
        text: mail.text,
        to: mail.to,
      });
     
      await this.mailsModel.updateOne({'_id': mailingId ,'mails.to': mail.to}, {'mails.$.isSent': true});

      await this.userModel.findOneAndUpdate(
        { _id: user.id },
        { $inc: { sentMessagesToday: 1 } },
      );

      const isMoreMailsToSentExist = !!notSentMails[1];
      if (isMoreMailsToSentExist) {
        await this._CloudTasks.createCloudTask({
          payload: {
            mailingId,
          },
          delay: 1,
        });
      } else {
        await this.mailsModel.findOneAndUpdate({_id: mailingId}, {isInProcess: false});
      }
    }

    return;
  }
}
