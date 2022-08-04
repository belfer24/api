import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { MicrosoftHelper } from 'src/helpers/microsoft/microsoft';

@Module({
  imports: [
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService, MicrosoftHelper],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
