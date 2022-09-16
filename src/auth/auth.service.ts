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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    private readonly _MicrosoftHelper: MicrosoftHelper,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async GetOutlookRedirectUrl() {
    const redirectUrl = await this._MicrosoftHelper.CreateRedirectUrl();

    return redirectUrl;
  }

  async HandleOutlookOAuth({
    code,
  }: IAuth.Service.OutlookRedirectHandler.Params) {
    const { account, refreshToken } = await this._MicrosoftHelper.GetAuthData({
      code,
    });

    const user = await this.userModel
      .exists({ email: account.username })
      .exec();

    // Добавить проверку на наличие юзера в страйпе

    if (!user) {
      const newCustomer = await this._StripeHelper.CreateCustomer({
        email: account.username,
      });

      await this.userModel.create({
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
    }

    const redirectUrl = `chrome-extension://${process.env.CHROME_EXTENSION_ID}/oauth/oauth.html?email=${account.username}&refreshToken=${refreshToken}&name=${account.name}`;

    return redirectUrl;
  }
}
