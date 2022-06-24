import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MailDocument = Mail & Document;

@Schema()
export class Mail {
  @Prop()
  mail: string;
  
  @Prop()
  addedAt: Date;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
