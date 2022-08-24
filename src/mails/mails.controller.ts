import { Body, Controller, Header, Post, Response } from '@nestjs/common';
import { MailsService } from './mails.service';

@Controller('mails')
export class MailsController {
  constructor(private mailsService: MailsService) {}

  @Post('/create-task')
  async createCloudTask(@Body() body, @Response() res: Response) {
    await this.mailsService.mailTasksCreate(body);
    
    return res;
  }

  @Post('/send-mails')
  async sendMails(@Body() body, @Response() res: Response) {
    await this.mailsService.sendOutlookMails(body);

    return res.json();
  }
}
