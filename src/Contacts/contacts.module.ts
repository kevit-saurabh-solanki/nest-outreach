import { Module } from "@nestjs/common";
import { ContactsControl } from "./contacts.controller";
import { ContactsService } from "./contacts.service";
import { MongooseModule } from "@nestjs/mongoose";
import { contactsSchema, ContactsSchema } from "./contacts.schema";

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: ContactsSchema.name,
            schema: contactsSchema
        }
    ])],
    controllers: [ContactsControl],
    providers: [ContactsService]
})
export class ContactsModule {}