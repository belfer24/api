import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailsDocument = Mails & Document;

@Schema()
export class Mails {
  @Prop()
  mails: any[];

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

export const MailSchema = SchemaFactory.createForClass(Mails);
