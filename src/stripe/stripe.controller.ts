import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import { HttpException } from '@nestjs/common/exceptions';
import { CreatePortalDto } from './dto/stripe.dto';

@Controller('stripe')
export class StripeController {
  constructor(private StripeService: StripeService) {}

  @Post('create-portal')
  async createPortal(
    @Body() createPortalDto: CreatePortalDto,
    @Res() res: Response,
  ) {
    const redirectLink = await this.StripeService.createStripePortal(
      createPortalDto.email,
      createPortalDto.returnUrl
    );

    if (redirectLink) {
      return res.redirect(redirectLink);
    } else {
      throw new HttpException('Bad request', 400);
    }
  }
}
