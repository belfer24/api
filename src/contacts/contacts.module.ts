import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Contacts, ContactsSchema } from './schemas/contacts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
    ]),
  ],
})
export class ContactsModule {}
