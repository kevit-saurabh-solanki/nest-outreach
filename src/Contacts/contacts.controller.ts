import { Controller } from "@nestjs/common";
import { ContactsService } from "./contacts.service";

@Controller('contacts')
export class ContactsControl {
    constructor(private contactService: ContactsService) {}
}