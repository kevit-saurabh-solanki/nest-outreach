import { Controller, UseGuards, Get, Post, Req, Param, Body, Put, Delete } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { ContactsDto, UpdateContactsDto } from "./contacts.dto";
import { UserGuard } from "src/Auth/user.guard";

@Controller('contacts')
export class ContactsControl {
    constructor(private contactService: ContactsService) { }

    @Get()
    @UseGuards(AuthGuard)
    getAllContacts(@Req() req: any) {
        return this.contactService.getAllContacts(req);
    }

    @Get(':contactId')
    @UseGuards(AuthGuard)
    getContactById(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId, @Req() req: any) {
        return this.contactService.getContactById(contactId, req);
    }

    @Post()
    @UseGuards(AuthGuard, UserGuard)
    addContact(@Body() contactDto: ContactsDto, @Req() req: any) {
        return this.contactService.addContact(contactDto, req);
    }

    @Put(':contactId')
    @UseGuards(AuthGuard, UserGuard)
    editContact(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId, @Body() updateContactDto: UpdateContactsDto, @Req() req: any) {
        return this.contactService.editContact(contactId, updateContactDto, req);
    }

    @Delete(':contactId')
    @UseGuards(AuthGuard, UserGuard)
    deleteContact(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId, @Req() req: any) {
        return this.contactService.deleteContact(contactId, req);
    }

}