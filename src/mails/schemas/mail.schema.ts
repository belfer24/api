import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

export type MailDocument = Mail & Document;

@Schema()
export class Mail {
  @Prop()
  mail: string;
  
  @Prop()
  addedAt: Date;

  @Prop({type: [Types.ObjectId], ref: User.name})
  userId: string;
}

export const MailSchema = SchemaFactory.createForClass(Mail);
