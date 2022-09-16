import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class Invoices {
  @Prop()
  date: string;

  @Prop()
  amount: number;

  @Prop()
  link: string;
}

const InvoicesSchema = SchemaFactory.createForClass(Invoices);

@Schema({ _id: false })
class Stripe {
  @Prop()
  customerId: string;

  @Prop()
  link: string;
}

const StripeSchema = SchemaFactory.createForClass(Stripe);

@Schema({ _id: false })
class Billing {
  @Prop()
  paid: boolean;

  @Prop()
  dailyLimit: number;

  @Prop({ type: StripeSchema })
  stripe: Stripe;

  @Prop({ type: [InvoicesSchema] })
  invoices: Invoices[];
}

const BillingSchema = SchemaFactory.createForClass(Billing);

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  refresh_token: string;

  @Prop({ type: BillingSchema })
  billing: Billing;

  @Prop()
  createdAt: Date;

  @Prop()
  sentMessagesToday: number;

  @Prop()
  isSending: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
