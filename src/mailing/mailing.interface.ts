export namespace IMails {
  export type Mail = {
    to: string;
    subject: string;
    text: string;
    isSent: boolean;
  };

  export namespace Controller {}

  export namespace Service {
    export namespace Start {
      export type Body = {
        refreshToken: string;
        mails: Mail[];
        csvData: Record<string, unknown>[];
      };
    }

    export namespace Send {
      export type Body = { mailingId: string };
    }

    export namespace Cancel {
      export type Body = {
        refreshToken: string;
      };
    }

    export namespace Retry {
      export type Body = {
        mailingId: string;
      };
    }

    export namespace GetMailing {
      export type Body = {
        authorization: string;
      };
    }

    export namespace SetError {
      export type Body = {
        mailingId: string;
      };
    }
  }
}
