import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Messages } from "./message.schema";
import mongoose, { Model } from 'mongoose'
import { MessageDto, UpdateMessageDto } from "./message.dto";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";
import { CacheService } from "src/Shared/cache/cache.service";
import { AuditPublisher } from "src/Shared/audit-logs/auditPublisher.service";


@Injectable()
export class MessageService {
    constructor(@InjectModel(Messages.name) private messageModel: Model<Messages>,
        @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
        @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>,
        private readonly cacheService: CacheService,
        private readonly auditPublisher: AuditPublisher) { }

    //get all message--------------------------------------------------------
    async getAllMessage() {
        return this.cacheService.wrap(`messages`, async () => {
            return await this.messageModel.find().exec();
        }, 120)
    }

    //get message by Id--------------------------------------------------------
    async getMessageById(messageId: mongoose.Schema.Types.ObjectId) {
        return this.cacheService.wrap(`message:${messageId}`, async () => {
            const singleMessage = await this.messageModel.findOne({ _id: messageId })
                .populate([
                    {
                        path: 'workspaceId',
                        select: 'name _id'
                    },
                    {
                        path: 'createdBy',
                        select: 'email _id'
                    }
                ]).exec();
            if (!singleMessage) throw new NotFoundException("Message not found");
            return singleMessage;
        }, 120)
    }

    //add message----------------------------------------------------------------
    async addMessage({ ...messageDto }: MessageDto, req: any) {
        try {
            if (!messageDto.imagePath || !messageDto.filePath || messageDto.messageType === "Text") {
                messageDto.imagePath = undefined;
                messageDto.filePath = undefined;
            }
            const newMessage = new this.messageModel({ createdBy: req.users._id, ...messageDto });
            const savedMessage = await newMessage.save();
            const logs = {
                actionTakenBy: savedMessage.createdBy,
                actionDoneAt: Date.now().toString(),
                actionTakenOn: savedMessage._id,
                action: 'Added',
                resource: 'Messages',
                workspaceId: savedMessage.workspaceId
            };
            this.auditPublisher.publishLogs(logs);
            const cacheKey = `messages:workspaceId:${savedMessage.workspaceId}`;
            await this.cacheService.del(cacheKey);
            return savedMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete message by ID----------------------------------------------------------
    async deleteMessage(messageId: mongoose.Schema.Types.ObjectId) {
        try {
            const deleteMessage = await this.messageModel.findOneAndDelete({ _id: messageId }).exec();
            if (!deleteMessage) throw new NotFoundException("message not found");
            const logs = {
                actionTakenBy: deleteMessage.createdBy,
                actionDoneAt: Date.now().toString(),
                actionTakenOn: deleteMessage._id,
                action: 'Deleted',
                resource: 'Messages',
                workspaceId: deleteMessage.workspaceId
            };
            this.auditPublisher.publishLogs(logs);
            const cacheKey = `messages:workspaceId:${deleteMessage.workspaceId}`;
            await this.cacheService.del(cacheKey);
            return deleteMessage;
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    }

    //edit message
    async editMessage(messageId: mongoose.Schema.Types.ObjectId, updateMessage: UpdateMessageDto) {
        try {
            if (!updateMessage.messageType) return;
            const updateOps: any = { ...updateMessage };
            if (updateMessage.messageType.trim().toLowerCase() === 'text') {
                updateOps.$unset = {
                    imagePath: "",
                    filePath: ""
                };
                delete updateOps.imagePath;
                delete updateOps.filePath;
            }
            const editMessage = await this.messageModel.findOneAndUpdate({ _id: messageId }, updateOps, { returnDocument: "after" }).exec();
            if (!editMessage) throw new NotFoundException("message not found");
            const cacheKey = `messages:workspaceId:${editMessage.workspaceId}`;
            await this.cacheService.del(cacheKey);
            const logs = {
                actionTakenBy: editMessage.createdBy,
                actionDoneAt: Date.now().toString(),
                actionTakenOn: editMessage._id,
                action: 'Updated',
                resource: 'Messages',
                workspaceId: editMessage.workspaceId
            };
            this.auditPublisher.publishLogs(logs);
            return editMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get messages by workspace id------------------------------------------
    async getMessagesByWorkspace(workspaceId: string) {
        return this.cacheService.wrap(`messages:workspaceId:${workspaceId}`, async () => {
            return await this.messageModel.find({ workspaceId }).exec();
        }, 120);
    }
}