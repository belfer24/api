import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Mail } from "src/mails/schemas/mail.schema";

export type UserDocument = User & Document;

class Invoices {
  @Prop()
  date: string;

  @Prop()
  amount: number;

  @Prop()
  link: string;
}

class Stripe {
  @Prop()
  customerId: string;

  @Prop()
  link: string;
}

class Billing {
  @Prop()
  paid: string;

  @Prop()
  stripe: Stripe;

  @Prop()
  invoices: Invoices[];
}

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  refresh_token: string;

  @Prop()
  billing: Billing;

  @Prop({type: [Types.ObjectId], ref: Mail.name})
  mails: Mail[]

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
