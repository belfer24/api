import { Body, Controller, Post, Response } from '@nestjs/common';
import { CancelSendDto, SendMessageDto, StartSendingDto } from './dto/mail.dto';

import { MailingService } from './mails.service';

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('start')
  async startSending(@Body() startSendingDto: StartSendingDto) {
    return this.mailingService.Start(startSendingDto);
  }

  @Post('cancel')
  async cancelSend(@Body() cancelSendDto: CancelSendDto) {
    return this.mailingService.Cancel(cancelSendDto.refreshToken);
  }

  @Post('send')
  async sendMails(
    @Body() sendMessageDto: SendMessageDto,
    @Response() res: Response,
  ) {
    await this.mailingService.Send(sendMessageDto);

    return res.json();
  }
}
