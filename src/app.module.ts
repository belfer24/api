import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { UsersModule } from './users/users.module';
import { MailsModule } from './mails/mails.module';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';

const uri = process.env.MONGODB_URI || '';

@Module({
  imports: [
    MongooseModule.forRoot(uri),
    UsersModule,
    MailsModule,
    AuthModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
