import { MicrosoftHelper } from '../microsoft/microsoft';
import { IOutlookHelper } from './outlook.interface';

export class OutlookHelper {
  private _MicrosoftHelper: MicrosoftHelper = new MicrosoftHelper();

  public async connectToGraph(
    refreshToken: string,
  ): IOutlookHelper.Methods.Connect.Response {
    await this._MicrosoftHelper.createGraph(refreshToken);
  }

  public async checkRefreshToken(
    refreshToken: string,
  ): IOutlookHelper.Methods.Available.Response {
    //TODO: Может обернуть в try catch?
    await this.connectToGraph(refreshToken);

    return true;
  }

  public async sendMessage(
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
