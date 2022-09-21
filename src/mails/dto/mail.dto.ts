type Mail = {
  to: string;
  subject: string;
  text: string;
  isSent: boolean;
};

export class CancelSendDto {
  refreshToken: string;
}

export class StartSendingDto {
  refreshToken: string;
  mails: Mail[];
  csvData: Record<string, unknown>[];
}

export class SendMessageDto {
  mailingId: string;
}
