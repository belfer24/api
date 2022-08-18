import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { MicrosoftHelper } from 'src/helpers/microsoft/microsoft';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { StripeHelper } from 'src/helpers/stripe/stripe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}]),
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService, MicrosoftHelper, StripeHelper],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
