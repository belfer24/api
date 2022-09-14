import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { MicrosoftHelper } from '@/helpers/microsoft/microsoft';
import { OutlookHelper } from '@/helpers/outlook/outlook';
import { MongooseModule } from '@nestjs/mongoose';
import { Mails, MailsSchema } from './schemas/mail.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';
import { Contacts, ContactsSchema } from '@/contacts/schemas/contacts.schema';
import { User, UserSchema } from '@/users/schemas/user.schema';

@Module({
  providers: [MailsService, MicrosoftHelper, OutlookHelper, CloudTasks],
  controllers: [MailsController],
  imports: [
    MongooseModule.forFeature([
      { name: Mails.name, schema: MailsSchema },
      { name: Contacts.name, schema: ContactsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class MailsModule {}
