import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Document, Types } from "mongoose";

export type ContactsDocument = Contacts & Document;

@Schema()
export class Contacts {
  @Prop()
  createdAt: Date;

  @Prop({type: mongoose.Schema.Types.Mixed})
  data: any;

  @Prop()
  userId: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
