import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { MicrosoftHelper } from '@/helpers/microsoft/microsoft';
import { OutlookHelper } from '@/helpers/outlook/outlook';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailing, MailingSchema } from './schemas/mailing.schema';
import { CloudTasks } from '@/helpers/cloud-tasks/cloud-tasks';
import { Contacts, ContactsSchema } from '@/contacts/schemas/contacts.schema';
import { User, UserSchema } from '@/users/schemas/user.schema';

@Module({
  providers: [MailingService, MicrosoftHelper, OutlookHelper, CloudTasks],
  controllers: [MailingController],
  imports: [
    MongooseModule.forFeature([
      { name: Mailing.name, schema: MailingSchema },
      { name: Contacts.name, schema: ContactsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
})
export class MailingModule {}
