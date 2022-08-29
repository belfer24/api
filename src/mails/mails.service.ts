import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Contacts,
  ContactsDocument,
} from 'src/contacts/schemas/contacts.schema';
import { CloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks';
import { ICloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks.interface';

import { OutlookHelper } from 'src/helpers/outlook/outlook';
import { User, UserDocument } from 'src/users/schemas/user.schema';
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
    try {
      const { outlookMessages, outlookRefreshToken, csvData, email } = params;

      const userFromEmail = await this.userModel.findOne({ email }).exec();

      this.contactsModel.create({
        data: csvData,
        createdAt: Date.now(),
        userId: userFromEmail._id,
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
    } catch (error) {
      throw error;
    }
  }

  async sendOutlookMessage(body: IMails.Messages.Message) {
    await this._OutlookHelper.connectToGraph(body.outlookRefreshToken);
    console.log(body);

    await this._OutlookHelper.sendMessage(body.message);
    return {};
  }
}
