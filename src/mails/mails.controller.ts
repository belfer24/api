import { Body, Controller, Post, Response } from '@nestjs/common';
import { IMails } from './mails.interface';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Post('create-tasks')
  async createCloudTask(
    @Body() taskBody: IMails.CloudTasks.Task,
    @Response() res: Response,
  ) {
    await this.mailsService.mailTasksCreate(taskBody);

    return res;
  }

  @Post('cancel-send')
  async cancelSend(@Body() body: { email: string }) {
    return this.mailsService.cancelSend(body.email);
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
