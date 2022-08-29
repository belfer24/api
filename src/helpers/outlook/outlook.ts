import { MicrosoftHelper } from '../microsoft/microsoft';
import { IOutlookHelper } from './outlook.interface';

export class OutlookHelper {
  private _MicrosoftHelper: MicrosoftHelper = new MicrosoftHelper();

  public async connectToGraph(
    refreshToken: string,
  ): IOutlookHelper.Methods.Connect.Response {
    try {
      await this._MicrosoftHelper.createGraph(refreshToken);
    } catch (error) {
      throw error;
    }
  }

  public async checkRefreshToken(
    refreshToken: string,
  ): IOutlookHelper.Methods.Available.Response {
    try {
      await this.connectToGraph(refreshToken);

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async sendMessage(
    messageData: IOutlookHelper.Methods.Send.Request,
  ): IOutlookHelper.Methods.Send.Response {
    try {
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
      const send = { message, saveToSentItems: false };

      await this._MicrosoftHelper.Graph.post('me/sendMail', send);
    } catch (error) {
      throw error;
    }
  }
}
