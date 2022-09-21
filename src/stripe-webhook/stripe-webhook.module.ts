import { Module } from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeHelper } from '@/helpers/stripe/stripe';

@Module({
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, StripeHelper],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ]
})
export class StripeWebhookModule {}
