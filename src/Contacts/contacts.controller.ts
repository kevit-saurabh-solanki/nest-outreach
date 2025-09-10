import { Controller, UseGuards, Get, Post, Req, Param, Body, Put, Delete } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { ContactsDto, UpdateContactsDto } from "./contacts.dto";
import { UserGuard } from "src/Auth/user.guard";

@Controller('contacts')
export class ContactsControl {
    constructor(private contactService: ContactsService) { }

    // @Get()
    // @UseGuards(AuthGuard)
    // getAllContacts() {
    //     return this.contactService.getAllContacts();
    // }

    @Get(':workspaceId')
    async getContacts(@Param('workspaceId') workspaceId: string) {
        return this.contactService.getContactsByWorkspace(workspaceId);
    }

    @Get(':contactId')
    @UseGuards(AuthGuard)
    getContactById(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId) {
        return this.contactService.getContactById(contactId);
    }

    @Post()
    @UseGuards(AuthGuard, UserGuard)
    addContact(@Body() contactDto: ContactsDto, @Req() req: any) {
        return this.contactService.addContact(contactDto, req);
    }

    @Put(':contactId')
    @UseGuards(AuthGuard, UserGuard)
    editContact(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId, @Body() updateContactDto: UpdateContactsDto) {
        return this.contactService.editContact(contactId, updateContactDto);
    }

    @Delete(':contactId')
    @UseGuards(AuthGuard, UserGuard)
    deleteContact(@Param('contactId') contactId: mongoose.Schema.Types.ObjectId) {
        return this.contactService.deleteContact(contactId);
    }

}