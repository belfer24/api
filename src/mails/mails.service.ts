import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Contacts,
  ContactsDocument,
} from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { OutlookHelper } from '@/helpers/outlook/outlook';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mails.interface';
import { Mails, MailsDocument } from './schemas/mail.schema';

@Injectable()
export class MailsService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly contactsModel: Model<ContactsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Mails.name) private readonly mailsModel: Model<MailsDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async mailTasksCreate(params: IMails.CloudTasks.Task) {
    const { outlookMessages, outlookRefreshToken, csvData, email } = params;
    const user = await this.userModel.findOne({ email }).exec();

    await this.contactsModel.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user?._id,
    });

    await this.mailsModel.create({
      mails: outlookMessages,
      createdAt: Date.now(),
      email,
      status: 'In progress',
      refresh_token: outlookRefreshToken,
    });

    let intervalId: NodeJS.Timer;
    const delay = 10000;

    intervalId = setInterval(async () => {
      const sendData = await this.mailsModel.findOne({ email }).exec();
      const lastMessage = sendData?.mails.length === 0;

      if (lastMessage || sendData?.status === 'Stop') {
        clearInterval(intervalId);
        console.log(sendData.status);
        await this.mailsModel.deleteOne({ email });
      } else {
        await this._CloudTasks.createCloudTask({
          payload: {
            message: sendData?.mails[0],
            lastMessage,
            outlookRefreshToken,
            email,
          },
          delay: 0,
        });

        await this.mailsModel.updateOne(
          { email },
          {
            $pop: { mails: 1 },
          },
        );
      }
    }, delay);

    return { success: true };
  }

  async cancelSend(email: string) {
    await this.mailsModel.updateOne({ email }, { status: 'Stop' });
  }

  async sendOutlookMessage(body: IMails.Messages.Message) {
    await this._OutlookHelper.connectToGraph(body.outlookRefreshToken || '');
    await this._OutlookHelper.sendMessage(body.message);

    const email = body.email;
    const increment = 1;
    await this.userModel.findOneAndUpdate(
      { email },
      { $inc: { sentMessagesToday: increment } },
    );
    console.log('Sent!');

    return {};
  }
}
