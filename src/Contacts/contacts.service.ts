import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Contacts } from "./contacts.schema";
import mongoose, { Model, mongo } from "mongoose"
import { ContactsDto, UpdateContactsDto } from "./contacts.dto";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";
import { count } from "console";
import { CacheService } from "src/Shared/cache/cache.service";
import { AuditPublisher } from "src/Shared/audit-logs/auditPublisher.service";

@Injectable()
export class ContactsService {
    constructor(@InjectModel(Contacts.name) private contactModel: Model<Contacts>,
        @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
        @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>,
        private cacheService: CacheService,
        private auditPublisher: AuditPublisher) { }

    //get all contacts------------------------------------------------------------
    async getAllContacts() {
        return this.cacheService.wrap('contacts', async () => {
            return await this.contactModel.find();
        }, 120);
    }

    //get contact by id--------------------------------------------------------------
    async getContactById(contactId: mongoose.Schema.Types.ObjectId) {
        return this.cacheService.wrap(`contact:${contactId}`, async () => {
            const foundContact = await this.contactModel.findById(contactId)
                .populate([
                    {
                        path: 'workspaceId',
                        select: '_id name'
                    },
                    {
                        path: 'createdBy',
                        select: '_id email'
                    }
                ]).exec();
            if (!foundContact) throw new NotFoundException("Contact not found");
            return foundContact;
        }, 120)
    }

    //add contact--------------------------------------------------------------------
    async addContact({ ...contactDto }: ContactsDto, req: any) {
        const findContact = await this.contactModel.findOne({ $and: [{ phoneNumber: contactDto.phoneNumber }, { workspaceId: contactDto.workspaceId }] }).exec();

        if (findContact) throw new ConflictException("Contact already exist in the workspace");
        const newContact = new this.contactModel({ createdBy: req.users._id, ...contactDto });
        const savedContact = await newContact.save();

        this.cacheService.set(`contact:${savedContact._id}`, savedContact, 120);
         const logs = {
            actionTakenBy: savedContact.createdBy,
            actionDoneAt: Date.now().toString(),
            action: 'Added',
            resource: 'Contacts',
            workspaceId: savedContact.workspaceId
        };
        this.auditPublisher.publishLogs(logs);
        return savedContact;
    }

    //delete contact------------------------------------------------------------------
    async deleteContact(contactId: mongoose.Schema.Types.ObjectId) {
        const deleteContact = await this.contactModel.findOneAndDelete({ _id: contactId }, { returnDocument: "after" }).exec();
        if (!deleteContact) throw new NotFoundException("Contact not found");
        this.cacheService.del(`contact:${deleteContact._id}`);
        const logs = {
            actionTakenBy: deleteContact.createdBy,
            actionDoneAt: Date.now().toString(),
            action: 'Deleted',
            resource: 'Contacts',
            workspaceId: deleteContact.workspaceId
        };
        this.auditPublisher.publishLogs(logs);
        return deleteContact;
    }

    //edit contact---------------------------------------------------------------------
    async editContact(contactId: mongoose.Schema.Types.ObjectId, { ...updateContactDto }: UpdateContactsDto) {
        const editContact = await this.contactModel.findByIdAndUpdate({ _id: contactId }, { ...updateContactDto }, { returnDocument: "after" }).exec();
        if (!editContact) throw new NotFoundException("Contact not found");
        this.cacheService.set(`contact:${editContact._id}`, editContact, 120);
        const logs = {
            actionTakenBy: editContact.createdBy,
            actionDoneAt: Date.now().toString(),
            action: 'Updated',
            resource: 'Contacts',
            workspaceId: editContact.workspaceId
        };
        this.auditPublisher.publishLogs(logs);
        return editContact;
    }

    //get contact by workspace id------------------------------------------
    async getContactsByWorkspace(workspaceId: string, page: number = 1, limit: number = 10) {
        return this.cacheService.wrap(`contacts:workspaceId:${workspaceId}`, async () => {
            const skip = (page - 1) * limit;

            const contacts = await this.contactModel
                .find({ workspaceId }) // filter contacts of this workspace
                .skip(skip)
                .limit(limit)
                .exec();

            const total = await this.contactModel.countDocuments({ workspaceId });

            return {
                data: contacts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }, 120)
    }

    //getToptags------------------------------------------------------
    async getTopTagsContacts(workspaceId: string) {
        const tags = await this.contactModel.aggregate([
            {
                $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId) }
            },
            {
                $unwind: "$tags"
            },
            {
                $group: {
                    _id: "$tags",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]).exec();

        return tags.map(tag => ({
            tag: tag._id,
            count: tag.count
        }));
    }
}