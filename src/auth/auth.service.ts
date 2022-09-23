import { Injectable } from '@nestjs/common';
import { MicrosoftHelper } from '@/helpers/microsoft/microsoft';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@/users/schemas/user.schema';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { IAuth } from './auth.inteface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserCollection: Model<UserDocument>,

    private readonly _MicrosoftHelper: MicrosoftHelper,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async GetOutlookRedirectUrl({
    chromeExtensionId,
  }: {
    chromeExtensionId: string;
  }) {
    const redirectUrl = await this._MicrosoftHelper.CreateRedirectUrl({
      chromeExtensionId,
    });

    return redirectUrl;
  }

  async HandleOutlookOAuth(
    params: IAuth.Service.OutlookRedirectHandler.Params,
  ) {
    const { code, state: chromeExtensionId } = params;
    const { account, refreshToken } = await this._MicrosoftHelper.GetAuthData({
      code,
    });

    const user = await this.UserCollection
      .findOne({ email: account.username })
      .exec();

    if(user) {
      const stripeCustomerId = user.billing.stripe.customerId;

      try {
        await this._StripeHelper.GetCustomerById(stripeCustomerId);
      } catch (error) {
        throw Error('User with this customerId not found!')
      }
    }

    if (!user) {
      const newCustomer = await this._StripeHelper.CreateCustomer({
        email: account.username,
      });

      await this.UserCollection.create({
        email: account.username,
        refreshToken,
        createdAt: Date.now(),
        sentMessagesToday: 0,
        billing: {
          paid: false,
          stripe: {
            customerId: newCustomer.id,
          },
          dailyLimit: 200,
        },
      });
    } else {
      await this.UserCollection.findOneAndUpdate({ email: account.username }, { refreshToken });
    }

    const redirectUrl = `chrome-extension://${chromeExtensionId}/oauth/oauth.html?email=${account.username}&refreshToken=${refreshToken}&name=${account.name}`;
    
    return redirectUrl;
  }
}
