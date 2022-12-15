import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContactsDocument = Contacts & Document;

@Schema()
export class Contacts {
  @Prop()
  createdAt: Date;

  @Prop()
  data: Record<string, unknown>[];

  @Prop()
  userId: string;

}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
