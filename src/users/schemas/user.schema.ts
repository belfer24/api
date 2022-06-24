import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Mail } from "src/mails/schemas/mail.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({type: [Types.ObjectId], ref: Mail.name})
  mails: Mail[]
}

export const UserSchema = SchemaFactory.createForClass(User);
