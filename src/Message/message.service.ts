import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
            const singleMessage = await this.messageModel.findOne({ _id: messageId }).exec();
            if (!singleMessage) throw new NotFoundException("Message not found");
            return singleMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //add message----------------------------------------------------------------
    async addMessage(messageDto: MessageDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;
            const findUser = await this.userModel.findById(messageDto.createdBy).exec();
            if (!findUser) throw new NotFoundException("User not found");
            const findWorkspace = await this.workspaceModel.findById(messageDto.workspaceId).exec();
            if (!findWorkspace) throw new NotFoundException("Workspace not found");

            const newMessage = new this.messageModel(messageDto);
            const savedMessage = await newMessage.save();
            return savedMessage
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    //delete message by ID----------------------------------------------------------
    async deleteMessage(messageId: mongoose.Schema.Types.ObjectId, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;

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
    async editMessage(messageId: mongoose.Schema.Types.ObjectId, updateMessage: UpdateMessageDto, req: any) {
        try {
            const role = req.users.role;
            if (role === "viewer") throw new UnauthorizedException;

            const editMessage = await this.messageModel.findOneAndUpdate({ _id: messageId }, { ...updateMessage }, { returnDocument: "after" }).exec();
            if (!editMessage) throw new NotFoundException("message not found");
            return editMessage;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
}