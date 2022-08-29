import { Body, Controller, Post, Response } from '@nestjs/common';
import { IMails } from './mails.interface';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Post('create-task')
  async createCloudTask(
    @Body() taskBody: IMails.CloudTasks.Task,
    @Response() res: Response,
  ) {
    await this.mailsService.mailTasksCreate(taskBody);

    return res;
  }

  @Post('send-mails')
  async sendMails(
    @Body() message: IMails.Messages.Message,
    @Response() res: Response,
  ) {
    await this.mailsService.sendOutlookMessage(message);

    return res.json();
  }
}
