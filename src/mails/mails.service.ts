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

@Injectable()
export class MailsService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly contactsModel: Model<ContactsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async mailTasksCreate(params: IMails.CloudTasks.Task) {
    const { outlookMessages, outlookRefreshToken, csvData, email } = params;

    const user = await this.userModel.findOne({ email }).exec();

    this.contactsModel.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user?._id,
    });

    const sent = outlookMessages.length;
    const delayInSeconds = 10;

    const mailPromises = outlookMessages.map((message, index: number) => {
      const delay = index * delayInSeconds;
      const lastMessage = outlookMessages.length - 1 === index;

      return this._CloudTasks.createCloudTask({
        payload: {
          message,
          lastMessage,
          outlookRefreshToken,
        },
        delay,
      });
    });

    await Promise.all(mailPromises);

    return { success: true };
  }

  async sendOutlookMessage(body: IMails.Messages.Message) {
    await this._OutlookHelper.connectToGraph(body.outlookRefreshToken || '');
    await this._OutlookHelper.sendMessage(body.message);

    return {};
  }
}
