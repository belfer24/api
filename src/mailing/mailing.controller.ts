import { Body, Controller, Get, Headers, Post } from '@nestjs/common';

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
  async retrySending(@Body() retryDto: RetryDto) {
    return this.mailingService.Retry(retryDto.mailingId);
  }

  @Get('get')
  async IsUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers);
  }
}
