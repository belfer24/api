export namespace ICloudTasks {
  export namespace Enum {
    export enum RequestMethod {
      Get = 'GET',
      Post = 'POST',
    }

    export enum ProjectName {
      MailProject = 'mails',
    }

    export enum Route {
      MailSend = 'mail-send',
    }
  }

  export type Payload = {
    message: {
      to: string,
      subject: string,
      text: string,
    },
    outlookRefreshToken: string,
    lastMessage: boolean,
    email: string,
  }

  export type Task = {
    payload: Payload,
    delay: number,
  }
}
