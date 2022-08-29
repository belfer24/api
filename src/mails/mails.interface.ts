export namespace IMails {
  export type MessageBody = {
    message: {
      to: string;
      from?: string;
      subject: string;
      text: string;
    };
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
      message: {
        to: string;
        subject: string;
        text: string;
        from?: string;
      };
      lastLetter?: boolean;
      outlookRefreshToken?: string;
    };
  }
}
