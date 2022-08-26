import { MicrosoftHelper } from '../microsoft/microsoft';
import { IOutlookHelper } from './outlook.interface';

export class OutlookHelper {
  private _MicrosoftHelper: MicrosoftHelper = new MicrosoftHelper();

  public async Connect(
    refreshToken: string,
  ): IOutlookHelper.Methods.Connect.Response {
    try {
      await this._MicrosoftHelper.createGraph(refreshToken);
    } catch (error) {
      throw error;
    }
  }

  public async Available(
    refreshToken: string,
  ): IOutlookHelper.Methods.Available.Response {
    try {
      await this.Connect(refreshToken);

      return true;
    } catch (error) {
      throw error;
    }
  }

  public async Send(
    letter: IOutlookHelper.Methods.Send.Request,
  ): IOutlookHelper.Methods.Send.Response {
    try {
      const message = {
        subject: letter.subject,
        body: {
          contentType: 'HTML',
          content: letter.text,
        },
        toRecipients: [
          {
            emailAddress: {
              address: letter.to,
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
