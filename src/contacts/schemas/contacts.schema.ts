import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type ContactsDocument = Contacts & Document;

@Schema()
export class Contacts {
  @Prop()
  userId: string;
  
  @Prop()
  createdAt: Date;

  @Prop()
  data;

  @Prop({type: [Types.ObjectId], ref: User.name})
  user_id: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
