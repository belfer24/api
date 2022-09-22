import { Injectable } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IStripe } from './stripe.interface';
import { StripeConstants } from '@/constants/stripe';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly UserCollection: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async createStripeProtal(refreshToken: string) {
    // const user = await this.UsersCollection.findOne({ email }).exec();
    const user = await this.UserCollection.findOne({ refreshToken }).exec();

    if (user) {
      const portalLink = await this._StripeHelper.CreateStripePortalUrl(
        user.billing.stripe.customerId,
      );

      return portalLink;
    } else {
      throw Error('User not found!');
    }
  }

  
}
