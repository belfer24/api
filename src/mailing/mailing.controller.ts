import { Body, Controller, Get, Headers, Post, Patch } from '@nestjs/common';

import { CancelSendDto, HeadersDto, RetryDto, SendMessageDto, StartSendingDto } from './dto/mailing.dto';

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
    return this.mailingService.Cancel(body);
  }

  @Post('send')
  async SendMails(
    @Body() body: SendMessageDto,
  ) {
    try {
      await this.mailingService.Send(body);
    } catch {
      await this.mailingService.SetError(body);
    }
  }

  @Patch('retry')
  async retrySending(@Body() body: RetryDto) {
    return this.mailingService.Retry(body);
  }

  @Get('get')
  async IsUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers);
  }
}
