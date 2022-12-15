import { Injectable } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IStripe } from './stripe.interface';

@Injectable()
export class StripeService {
  constructor(
    @InjectModel(User.name) private readonly UserCollection: Model<UserDocument>,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async CreateStripePortal(params: IStripe.Service.CreateStripePortal.Body) {
    const { refreshToken, returnUrl } = params;
    const user = await this.UserCollection.findOne({ refreshToken });
    
    if (user) {
      const portalLink = await this._StripeHelper.CreateStripePortalUrl(
        user.billing.stripe.customerId,
        returnUrl
      );

      return portalLink;
    } else {
      throw Error('User not found!');
    }
  }
}
