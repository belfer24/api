import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import { UsersModule } from './users/users.module';

const uri = process.env.MONGODB_URI

@Module({
  imports: [MongooseModule.forRoot(uri), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
