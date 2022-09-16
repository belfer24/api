import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts, ContactsDocument } from '@/contacts/schemas/contacts.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';

import { OutlookHelper } from '@/helpers/outlook/outlook';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { IMails } from './mails.interface';
import { Mails, MailsDocument } from './schemas/mail.schema';
import { CancelSendDto } from './dto/mail.dto';
import { cloudTasksUrl } from '@/constants/urls';

@Injectable()
export class SendingService {
  constructor(
    @InjectModel(Contacts.name)
    private readonly contactsModel: Model<ContactsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Mails.name) private readonly mailsModel: Model<MailsDocument>,
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  //TODO: Нужно доставать id с токена в куках, делать запрос в БД нужно по id, а не по email ОЧЕНЬ ВАЖНО!!!!!!!!
  async Start({ mails, csvData, refreshToken }: IMails.Controller.Start.Body) {
    const user = await this.userModel.findOne({ refreshToken }).exec();

    await this.contactsModel.create({
      data: csvData,
      createdAt: Date.now(),
      userId: user!._id || 'anonymous',
    });

    if (!user) throw new Error('ERROR');

    //TODO: Добавить статусы isSent во все mails

    //TODO: Передалать статус на булевые, isCompleted, isInProgress
    const { _id: mailingId } = await this.mailsModel.create({
      mails,
      createdAt: Date.now(),
      userId: user._id,
      isInProgress: true,
    });

    await this._CloudTasks.createCloudTask({
      payload: {
        mailingId,
      },
      delay: 0,
    });

    return { success: true };
  }

  async Cancel({ mailingId }) {
    //TODO: Получить mailing и поставить isInProcess = false
  }

  async Send({ mailingId }: IMails.Controller.Send.Body) {
    const mailing = await this.mailsModel.findById(mailingId).exec();

    if (!mailing) throw new Error('ERROR');

    if (mailing.isInProcess) {
      const notSentMails = mailing.mails.filter((mail) => mail.isSent !== true);

      if (notSentMails.length) {
        //TODO: ДОПИСАТЬ ЛОГИКУ
      }

      const mail = notSentMails[0];

      const user = await this.userModel.findById(mailing.userId).exec();

      if (!user) throw new Error('ERROR');

      await this._OutlookHelper.connectToGraph(user.refreshToken);
      await this._OutlookHelper.sendMessage({
        subject: mail.subject,
        text: mail.text,
        to: mail.to,
      });

      //TODO: Дописать логику. Поменять isSent для отправленного письма на true

      await this.userModel.findOneAndUpdate(
        { _id: user.id },
        { $inc: { sentMessagesToday: 1 } },
      );

      //TODO: Добавить проверку есть ли в списке ещё письма которые нужно отправить и только тогда создавать таску на отправку
      const isMoreMailsToSentExist = !!notSentMails[1];
      if (isMoreMailsToSentExist) {
        //TODO: Поставь delay
        await this._CloudTasks.createCloudTask({
          payload: {
            mailingId,
          },
          delay: 10000,
        });
      } else {
        //TODO: Поставить isInProcess = false
      }
    }

    return;
  }
}
