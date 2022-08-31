import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Contacts } from '@/contacts/schemas/contacts.schema';
import { Mail } from '@/mails/schemas/mail.schema';

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
  dailyLimit: number;

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

  @Prop()
  mails: Mail[];

  @Prop({ type: [Types.ObjectId], ref: Contacts.name })
  contactsData: Contacts[];

  @Prop()
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
