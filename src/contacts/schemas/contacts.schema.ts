import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContactsDocument = Contacts & Document;

@Schema()
export class Contacts {
  @Prop()
  userId: string;
  
  @Prop()
  createdAt: Date;

  @Prop()
  data;

  @Prop()
  user_id: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
