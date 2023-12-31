import Axios, { AxiosInstance } from 'axios';
import {
  Configuration,
  ConfidentialClientApplication,
  ICachePlugin,
  ResponseMode,
} from '@azure/msal-node';
import { MicrosoftConstants } from '@/constants/microsoft';
import { RequestUtils } from '@/utils/request';
import { outlookRedirectUrl } from '@/constants/urls';

export class MicrosoftHelper {
  private _clientId: string = process.env.OUTLOOK_CLIENT_ID || '';
  private _clientSecret: string = process.env.OUTLOOK_SECRET_ID || '';
  private _cachePlugin: ICachePlugin;
  private _refreshToken: string;
  public Graph: AxiosInstance;

  constructor() {
    this._cachePlugin = {
      beforeCacheAccess: async () => {
        return;
      },

      afterCacheAccess: async (cacheContext) => {
        if (cacheContext.cacheHasChanged) {
          const data = cacheContext.tokenCache.serialize();
          const { RefreshToken } = await JSON.parse(data);
          const [{ secret }]: { secret: string }[] =
            Object.values(RefreshToken);

          this._refreshToken = secret;
        }
      },
    };
  }

  private _CreateOAuthClient() {
    const configuration: Configuration = {
      auth: {
        clientId: this._clientId,
        clientSecret: this._clientSecret,
      },
      cache: { cachePlugin: this._cachePlugin },
    };

    return new ConfidentialClientApplication(configuration);
  }

  public async CreateRedirectUrl({
    chromeExtensionId,
  }: {
    chromeExtensionId: string;
  }) {
    const client = this._CreateOAuthClient();

    const url = await client.getAuthCodeUrl({
      state: chromeExtensionId,
      prompt: 'select_account',
      responseMode: ResponseMode.QUERY,
      scopes: [
        'openid',
        'email',
        'profile',
        'offline_access',
        'User.Read',
        'Mail.Send',
      ],
      redirectUri: outlookRedirectUrl,
    });

    return url;
  }

  public async GetAuthData({ code }: { code: string }) {
    const client = this._CreateOAuthClient();

    const data = await client.acquireTokenByCode({
      code,
      redirectUri: outlookRedirectUrl,
      scopes: [
        'openid',
        'email',
        'profile',
        'offline_access',
        'User.Read',
        'Mail.Send',
      ],
    });

    if (!data || !data.account || !data.account.username) throw Error('Auth data not found!');

    return { account: data.account, refreshToken: this._refreshToken };
  }

  private async _GetAccessTokenByRefreshToken(refreshToken: string) {
    const { data } = await Axios.post(
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      RequestUtils.ObjectToQuery({
        grant_type: 'refresh_token',
        client_id: this._clientId,
        client_secret: this._clientSecret,
        scopes: MicrosoftConstants.Scopes.join(' '),
        refresh_token: refreshToken,
      }),
    );

    return data;
  }

  public async CreateGraph(outlookRefreshToken: string) {
    const tokens = await this._GetAccessTokenByRefreshToken(
      outlookRefreshToken,
    );

    this.Graph = Axios.create({
      baseURL: MicrosoftConstants.Url.Graph,
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    return tokens.access_token;
  }
}
