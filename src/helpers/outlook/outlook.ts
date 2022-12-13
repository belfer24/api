import { MicrosoftHelper } from '../microsoft/microsoft';
import { IOutlookHelper } from './outlook.interface';

export class OutlookHelper {
  private _MicrosoftHelper: MicrosoftHelper = new MicrosoftHelper();

  public async ConnectToGraph(
    refreshToken: string,
  ): IOutlookHelper.Methods.Connect.Response {
    await this._MicrosoftHelper.CreateGraph(refreshToken);
  }

  public async CheckRefreshToken(
    refreshToken: string,
  ): IOutlookHelper.Methods.Available.Response {
    try {
      await this.ConnectToGraph(refreshToken);
      return true;
    } catch {
      throw Error('Refresh token is expired');
    }
  }

  public async SendMessage(
    messageData: IOutlookHelper.Methods.Send.Request,
  ): IOutlookHelper.Methods.Send.Response {
    const message = {
      subject: messageData.subject,
      body: {
        contentType: 'HTML',
        content: messageData.text,
      },
      toRecipients: [
        {
          emailAddress: {
            address: messageData.to,
          },
        },
      ],
    };

    await this._MicrosoftHelper.Graph.post('me/sendMail', {
      message,
      saveToSentItems: true,
    });
  }
}
