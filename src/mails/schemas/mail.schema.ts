import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MailDocument = Mail & Document;

@Schema()
export class Mail {
  @Prop()
  mail: string;

  @Prop()
  addedAt: Date;

  @Prop()
  userId: string;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
