import { IMails } from '@/mailing/mailing.interface';

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

  export type Task = {
    payload: IMails.Controller.Send.Body;
    delay: number;
  };
}
