import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class Stripe {
  @Prop()
  id: string;
}
