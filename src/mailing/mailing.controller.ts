import { Body, Controller, Get, Headers, Post, Response } from '@nestjs/common';

import { CancelSendDto, HeadersDto, SendMessageDto, StartSendingDto } from './dto/mailing.dto';

import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('start')
  async StartSending(@Body() body: StartSendingDto) {
    return this.mailingService.Start(body);
  }

  @Post('cancel')
  async CancelSend(@Body() body: CancelSendDto) {
    return this.mailingService.Cancel(body.refreshToken);
  }

  @Post('send')
  async SendMails(
    @Body() body: SendMessageDto,
    @Response() res: Response,
  ) {
    try {
      await this.mailingService.Send(body);

      const result = await res.json();

      return result;
    } catch {
      await this.mailingService.SetError(body.mailingId);
    }
  }

  @Get('get')
  async isUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers.authorization);
  }
}
