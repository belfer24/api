import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailingDocument = Mailing & Document<string>;

@Schema()
class Mail {
  @Prop()
  to: string;

  @Prop()
  text: string;

  @Prop()
  subject: string;

  @Prop()
  isSent: boolean;

  @Prop()
  sentAt: number;

  @Prop()
  isInProcess: boolean;
}

const MailSchema = SchemaFactory.createForClass(Mail);

@Schema()
export class Mailing {
  @Prop()
  userId: string;

  @Prop({ type: [MailSchema] })
  mails: Mail[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isInProcess: boolean;

  @Prop()
  sentAt: number;

  @Prop()
  hasError: boolean;

  @Prop()
  isRetried: boolean;
}

export const MailingSchema = SchemaFactory.createForClass(Mailing);
