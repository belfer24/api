import { Body, Controller, Post, Response } from '@nestjs/common';
import { CancelSendDto } from './dto/mail.dto';
import { IMails } from './mails.interface';
import { MailsService } from './mails.service';

//TODO: Переименовать ВСЁ в mailing
@Controller('mailing')
export class MailingController {
  constructor(private mailsService: MailsService) {}

  @Post('start')
  async startSending(@Body() params: IMails.Controller.StartSending.Body) {
    return this.mailsService.startSending(params);
  }

  @Post('cancel')
  async cancelSend(@Body() cancelSendDto: CancelSendDto) {
    return this.mailsService.cancelSend(cancelSendDto);
  }

  @Post('send')
  async sendMails(
    @Body() message: IMails.Messages.Message,
    @Response() res: Response,
  ) {
    await this.mailsService.sendOutlookMessage(message);

    return res.json();
  }
}
