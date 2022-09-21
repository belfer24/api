import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type MailsDocument = Mails & Document;

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
}

const MailSchema = SchemaFactory.createForClass(Mail);

@Schema()
export class Mails {
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
}

export const MailsSchema = SchemaFactory.createForClass(Mails);
