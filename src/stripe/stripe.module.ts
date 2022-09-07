import { Module } from '@nestjs/common';
import { StripeHelper } from '@/helpers/stripe/stripe';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/schemas/user.schema';

@Module({
  controllers: [StripeController],
  providers: [StripeService, StripeHelper],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class StripeModule {}
