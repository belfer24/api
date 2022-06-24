import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';

@Module({
  providers: [MailsService],
  controllers: [MailsController],
  imports: [
    MongooseModule.forFeature([
      { name: Mail.name, schema: MailSchema}
    ])
  ]
})
export class MailsModule {}
