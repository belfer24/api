import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailsDocument = Mails & Document;

class Mail {
  @Prop()
  to: string;

  @Prop()
  text: string;

  @Prop()
  subject: string;
}

const MailSchema = SchemaFactory.createForClass(Mail);

@Schema()
export class Mails {
  @Prop({ type: [MailSchema]})
  mails: Mail[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  email: string;

  @Prop()
  status: string;

  @Prop()
  refresh_token: string;
}

export const MailsSchema = SchemaFactory.createForClass(Mails);
