import { Injectable } from '@nestjs/common';
import { CloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks';
import { ICloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks.interface';

import { OutlookHelper } from 'src/helpers/outlook/outlook';

@Injectable()
export class MailsService {
  constructor(
    private readonly _CloudTasks: CloudTasks,
    private readonly _OutlookHelper: OutlookHelper,
  ) {}

  async mailTasksCreate(params) {
    try {
      const { outlookMessages, outlookRefreshToken } = params;

      const sent = outlookMessages.length;
      const durationInSeconds = 3;

      const mailPromises = outlookMessages.map((letter, index) => {
        const delay = index * durationInSeconds;
        const lastLetter = outlookMessages.length - 1 === index;

        return this._CloudTasks.createCloudTask({
          payload: {
              letter,
              lastLetter,
              outlookRefreshToken,
          },
          delay,
        })
      })

      await Promise.all(mailPromises);

      return { success: true }
    } catch (error) {
      throw error
    }
  }

  async sendOutlookMails(body) {
    await this._OutlookHelper.Connect(body.outlookRefreshToken);
    await this._OutlookHelper.Send(body.letter);
    console.log("Send done!");

    return {}
  }
}
