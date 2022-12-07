import { Body, Controller, Get, Headers, Post, Response } from '@nestjs/common';

import { CancelSendDto, HeadersDto, SendMessageDto, StartSendingDto } from './dto/mailing.dto';

import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Post('start')
  async StartSending(@Body() startSendingDto: StartSendingDto) {
    return this.mailingService.Start(startSendingDto);
  }

  @Post('cancel')
  async CancelSend(@Body() cancelSendDto: CancelSendDto) {
    return this.mailingService.Cancel(cancelSendDto.refreshToken);
  }

  @Post('send')
  async SendMails(
    @Body() sendMessageDto: SendMessageDto,
    @Response() res: Response,
  ) {
    try {
      await this.mailingService.Send(sendMessageDto);

      const result = await res.json();

      return result;
    } catch {
      await this.mailingService.SetError(sendMessageDto.mailingId);
    }
  }

  @Get('get')
  async isUserSending(@Headers() headers: HeadersDto) {
    return this.mailingService.GetMailing(headers.authorization);
  }
}
