import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { MessageDto, UpdateMessageDto } from "./message.dto";
import { UserGuard } from "src/Auth/user.guard";

@Controller('messages')
export class MessageControl {
    constructor(private messageService: MessageService) {}

    @Get()
    @UseGuards(AuthGuard)
    getAllMessage() {
        return this.messageService.getAllMessage();
    }

    @Get(':messageId')
    @UseGuards(AuthGuard)
    getMessageById(@Param('messageId') messageId: mongoose.Schema.Types.ObjectId) {
        return this.messageService.getMessageById(messageId);
    }

    @Post()
    @UseGuards(AuthGuard, UserGuard)
    addMessage(@Body() messageDto: MessageDto, @Req() req: any) {
        return this.messageService.addMessage(messageDto, req);
    }

    @Delete(':messageId')
    @UseGuards(AuthGuard, UserGuard)
    deleteMessage(@Param('messageId') messageId: mongoose.Schema.Types.ObjectId) {
        return this.messageService.deleteMessage(messageId);
    }

    @Put(':messageId')
    @UseGuards(AuthGuard, UserGuard)
    editMessage(@Param('messageId') messageId: mongoose.Schema.Types.ObjectId, @Body() updateMessageDto: UpdateMessageDto) {
        return this.messageService.editMessage(messageId, updateMessageDto);
    } 
}