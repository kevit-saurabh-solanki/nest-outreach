import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MessageSchema } from "./message.schema";
import mongoose, { Model } from 'mongoose'
import { MessageDto, UpdateMessageDto } from "./message.dto";
import { UsersSchema } from "src/Users/users.schema";
import { WorkspaceSchema } from "src/Workspace/workspace.schema";


@Injectable()
export class MessageService {
    constructor(@InjectModel(MessageSchema.name) private messageModel: Model<MessageSchema>,
        @InjectModel(UsersSchema.name) private userModel: Model<UsersSchema>,
        @InjectModel(WorkspaceSchema.name) private workspaceModel: Model<WorkspaceSchema>) { }

    //get all message--------------------------------------------------------
    async getAllMessage() {
        try {
            const allMessage = await this.messageModel.find({}).exec();
            return allMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get message by Id--------------------------------------------------------
    async getMessageById(messageId: mongoose.Schema.Types.ObjectId) {
        try {
            const singleMessage = await this.messageModel.findOne({ _id: messageId }).populate(['workspaceId', 'createdBy']).exec();
            if (!singleMessage) throw new NotFoundException("Message not found");
            return singleMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
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
            return savedMessage
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
            return editMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //get messages by workspace id------------------------------------------
    async getMessagesByWorkspace(workspaceId: string) {
        const messages = await this.messageModel.find({ workspaceId }).exec();
        if (!messages) throw new NotFoundException('No messages found for this workspace');
        return messages;
    }
}