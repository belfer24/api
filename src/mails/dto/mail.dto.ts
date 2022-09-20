type Mail = {
  to: string;
  subject: string;
  text: string;
};

export class CancelSendDto {
  email: string;
}

export class StartSendingDto {
  refreshToken: string;
  mails: Mail[];
  csvData: Record<string, unknown>[];
}

export class SendMessageDto {
  mailingId: string;
}
