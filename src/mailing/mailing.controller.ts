import { Body, Controller, Get, Headers, Post, Response } from '@nestjs/common';

import { CancelSendDto, HeadersDto, SendMessageDto, StartSendingDto } from './dto/mailing.dto';

import { MailingService } from './mailing.service';

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
    try {
      await this.mailingService.Send(sendMessageDto);

      return res.json();
    } catch {
      await this.mailingService.SetError(sendMessageDto.mailingId);
    }
  }

  @Get('get')
  async isUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers.authorization);
  }
}
