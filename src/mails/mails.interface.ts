export namespace IMails {
  export type MessageBody = {
    to: string;
    from?: string;
    subject: string;
    text: string;
  };

  export namespace CloudTasks {
    export type Task = {
      outlookMessages: MessageBody[];
      outlookRefreshToken: string;
      csvData: unknown[];
      email: string;
    };
  }

  export namespace Messages {
    export type Message = {
      message: MessageBody;
      lastLetter?: boolean;
      outlookRefreshToken?: string;
      email: string;
    };
  }
}
