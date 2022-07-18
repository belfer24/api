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


  outlookLogin(req) {
    if (!req.user) {
      return 'No user from outlook'
    }

    return {
      message: 'User information from outlook',
      user: req.user
    }
  }
}
