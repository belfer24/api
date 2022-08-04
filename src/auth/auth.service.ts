import { Injectable } from '@nestjs/common';
import { MicrosoftHelper } from 'src/helpers/microsoft/microsoft';

@Injectable()
export class AuthService {
  constructor(
    private readonly _MicrosoftHelper: MicrosoftHelper,
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

      const redirectUrl = `chrome-extension://${chromeExtensionId}/oauth/oauth.html?email=${account.username}&token=${refreshToken}&name=${account.name}`

      return { redirectUrl };
    } catch (error) {
      throw error
    }
  }
}
