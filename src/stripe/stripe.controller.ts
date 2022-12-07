import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions';
import { CreatePortalDto } from './dto/stripe.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(
    @Body() createPortalDto: CreatePortalDto,
    @Res() res: Response,
  ) {
    const redirectLink = await this.StripeService.createStripePortal(
      createPortalDto.refreshToken,
      createPortalDto.returnUrl,
    );

    //TODO: Что будет видеть юзер на клиенте при 400?
    if (redirectLink) {
      return res.redirect(redirectLink);
    } else {
      throw new HttpException('Bad request', 400);
    }
  }
}
