export interface IMicrosoftConstants {
  Url: {
      Token: string;
      Graph: string;
  };
  Scopes: string[];
}

export const MicrosoftConstants: IMicrosoftConstants = {
  Url: {
    Token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    Graph: 'https://graph.microsoft.com/v1.0/',
  },
  Scopes: ['https://graph.microsoft.com/Mail.Send', 'https://graph.microsoft.com/Mail.ReadWrite'],
};
