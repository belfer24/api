export namespace IMails {
  export type Mail = {
    to: string;
    subject: string;
    text: string;
    isSent: boolean;
  };

  export namespace Controller {
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
  }
}
