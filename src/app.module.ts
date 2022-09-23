import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { SelectorsModule } from './selectors/selectors.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';

const uri = process.env.MONGODB_URI as string;

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    UsersModule,
    MailingModule,
    AuthModule,
    StripeModule,
    SelectorsModule,
    StripeWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
