import axios, { AxiosInstance } from 'axios';
import {
    Configuration,
    ConfidentialClientApplication,
    ICachePlugin,
    ResponseMode,
} from '@azure/msal-node';

import * as dotenv from 'dotenv';
dotenv.config();

export class MicrosoftHelper {
    private _clientId = process.env.OUTLOOK_CLIENT_ID;
    private _clientSecret = process.env.OUTLOOK_SECRET_ID;
    private _cachePlugin: ICachePlugin;
    private _refreshToken: string;
    public Graph: AxiosInstance;

    constructor() {
        this._cachePlugin = {
            beforeCacheAccess: async cacheContext => {
                return;
            },

            afterCacheAccess: async cacheContext => {
                if (cacheContext.cacheHasChanged) {
                    const data = cacheContext.tokenCache.serialize();
                    const { RefreshToken } = await JSON.parse(data);
                    const [{ secret }]:any = Object.values(RefreshToken);

                    this._refreshToken = secret;
                }
            }
        }
    }

    private _CreateOAuthClient() {
        try {
            const configuration: Configuration = {
                auth: {
                    clientId: this._clientId,
                    clientSecret: this._clientSecret,
                },
                cache: { cachePlugin: this._cachePlugin },
            }

            return new ConfidentialClientApplication(configuration);
        } catch(error) {
            throw error;
        }
    }

    public async CreateRedirectUrl({
        chromeExtensionId,
    }) {
        try {
            const client = this._CreateOAuthClient();

            const url = await client.getAuthCodeUrl({
                state: chromeExtensionId,
                prompt: 'select_account',
                responseMode: ResponseMode.QUERY,
                scopes: ['openid', 'email', 'profile', 'offline_access', 'User.Read'],
                redirectUri: 'http://localhost:3000/auth/redirect',
            })

            return url;
        } catch (error) {
            throw error;
        }
    }

    public async GetAuthData({ code }) {
        try {
            const client = this._CreateOAuthClient();
            const data = await client.acquireTokenByCode({
                code,
                redirectUri: 'http://localhost:3000/auth/redirect',
                scopes: ['openid', 'email', 'profile', 'offline_access', 'User.Read'],
            })

            if (!data || !data.account || !data.account.username) throw Error("Error!")

            return { account: data.account, refreshToken: this._refreshToken }
        } catch (error) {
            throw error
        }
    }
}