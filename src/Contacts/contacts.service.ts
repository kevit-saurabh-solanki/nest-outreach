import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ContactsSchema } from "./contacts.schema";
import mongoose, { Model } from "mongoose"
import { ContactsDto, UpdateContactsDto } from "./contacts.dto";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";

@Injectable()
export class ContactsService {
    constructor(@InjectModel(ContactsSchema.name) private contactModel: Model<ContactsSchema>,
                @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
                @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //get all contacts------------------------------------------------------------
    async getAllContacts(req: any) {
        try {
            const allContacts = await this.contactModel.find({}).exec();
            return allContacts;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get contact by id--------------------------------------------------------------
    async getContactById(contactId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const foundContact = await this.contactModel.findById(contactId).populate(['workspaceId, createdBy']).exec();
            if (!foundContact) throw new NotFoundException("Contact not found");
            return foundContact;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //add contact--------------------------------------------------------------------
    async addContact(contactDto: ContactsDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;
            const findContact = await this.contactModel.findOne({ $and: [{ phoneNumber: contactDto.phoneNumber }, { workspaceId: contactDto.workspaceId }] }).exec();
            if (findContact) throw new ConflictException("Contact already exist in the workspace");
            const { workspaceId, createdBy } = contactDto;
            const findUser = await this.userModel.findById(createdBy).exec();
            if (!findUser) throw new NotFoundException("User not found");
            const findWorkspace = await this.workspaceModel.findById(workspaceId).exec();
            if (!findWorkspace) throw new NotFoundException("Workspace not found");
            const newContact = new this.contactModel(contactDto);
            const savedContact = await newContact.save();
            return savedContact;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete contact------------------------------------------------------------------
    async deleteContact(contactId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;
            const deleteContact = await this.contactModel.findOneAndDelete({ _id: contactId }, { returnDocument: "after" }).exec();
            if (!deleteContact) throw new NotFoundException("Contact not found");
            return deleteContact;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //edit contact---------------------------------------------------------------------
    async editContact(contactId: mongoose.Schema.Types.ObjectId, {...updateContactDto}: UpdateContactsDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;
            const editContact = await this.contactModel.findByIdAndUpdate({ _id: contactId }, { ...updateContactDto }, { returnDocument: "after" }).exec();
            if (!editContact) throw new NotFoundException("Contact not found");
            return editContact;
        }
        catch(err) {
            console.log(err);
            return err;
        }
    }
}