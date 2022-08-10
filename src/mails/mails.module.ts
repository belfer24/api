import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MicrosoftHelper } from 'src/helpers/microsoft/microsoft';
import { OutlookHelper } from 'src/helpers/outlook/outlook';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';
import { CloudTasks } from 'src/helpers/cloud-tasks/cloud-tasks';

@Module({
  providers: [MailsService, MicrosoftHelper, OutlookHelper, CloudTasks],
  controllers: [MailsController],
  imports: [
    MongooseModule.forFeature([
      { name: Mail.name, schema: MailSchema}
    ])
  ]
})
export class MailsModule {}
