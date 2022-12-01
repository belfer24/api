import { Body, Controller, Get, Headers, Patch, Post, Response } from '@nestjs/common';

import { CancelSendDto, HeadersDto, RetryDto, SendMessageDto, StartSendingDto } from './dto/mailing.dto';

import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('start')
  async startSending(@Body() startSendingDto: StartSendingDto) {
    return this.mailingService.Start(startSendingDto);
  }

  @Post('cancel')
  async cancelSending(@Body() cancelSendDto: CancelSendDto) {
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

  @Patch('retry')
  async retrySending(@Body() retryDto: RetryDto) {
    return this.mailingService.Retry(retryDto.mailingId);
  }

  @Get('get')
  async isUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers.authorization);
  }
}
