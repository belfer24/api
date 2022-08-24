import { Injectable } from '@nestjs/common';
import { MicrosoftHelper } from 'src/helpers/microsoft/microsoft';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { StripeHelper } from 'src/helpers/stripe/stripe';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    private readonly _MicrosoftHelper: MicrosoftHelper,
    private readonly _StripeHelper: StripeHelper,
  ) {}

  async GetOutlookRedirectUrl({
    chromeExtensionId,
  }) {
    try {
      const redirectUrl = await this._MicrosoftHelper.CreateRedirectUrl({
        chromeExtensionId,
      })

      return { redirectUrl };
    } catch (error) {
      throw error;
    }
  }

  async OutlookOAuthHandler(params) {
    try {
      const { code, state: chromeExtensionId } = params;
      const { account, refreshToken }: any = await this._MicrosoftHelper.GetAuthData({ code });

      const user = await this.userModel.exists({ email: account.username }).exec();
      if (!user) {
        const newCustomer = await this._StripeHelper.CreateCustomer({
          email: account.username,
        });

        this.userModel.create({
          email: account.username,
          refresh_token: refreshToken,
          createdAt: Date.now(),
          billing: {
            stripe: {
              customerId: newCustomer.id,
            },
          },
        });
      } else {
        this.userModel.findOneAndUpdate(
          {
            email: account.username,
          },
          {
            refresh_token: refreshToken,
          },
        );
      }

      const redirectUrl = `chrome-extension://${chromeExtensionId}/oauth/oauth.html?email=${account.username}&token=${refreshToken}&name=${account.name}`

      return { redirectUrl };
    } catch (error) {
      throw error
    }
  }
}
