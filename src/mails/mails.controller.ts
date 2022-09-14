import { Body, Controller, Post, Response } from '@nestjs/common';
import { CancelSendDto } from './dto/mail.dto';
import { IMails } from './mails.interface';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Post('create-tasks')
  async createCloudTask(
    @Body() taskBody: IMails.CloudTasks.Task,
  ) {
    return this.mailsService.mailTasksCreate(taskBody);
  }

  @Post('cancel-send')
  async cancelSend(@Body() cancelSendDto: CancelSendDto) {
    return this.mailsService.cancelSend(cancelSendDto);
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
