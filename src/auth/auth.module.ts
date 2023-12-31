import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MicrosoftHelper } from '@/helpers/microsoft/microsoft';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/users/schemas/user.schema';
import { StripeHelper } from '@/helpers/stripe/stripe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  providers: [AuthService, MicrosoftHelper, StripeHelper],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
