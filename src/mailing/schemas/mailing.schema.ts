import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailingDocument = Mailing & Document;

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
}

export const MailingSchema = SchemaFactory.createForClass(Mailing);
