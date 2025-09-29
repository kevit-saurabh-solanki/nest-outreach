import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MessageService } from "./message.service";
import { AuthGuard } from "src/Auth/auth.guard";
import mongoose from "mongoose";
import { MessageDto, UpdateMessageDto } from "./message.dto";
import { UserGuard } from "src/Auth/user.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller('messages')
export class MessageControl {
    constructor(private messageService: MessageService) { }

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

    @Get('workspace/:workspaceId')
    @UseGuards(AuthGuard)
    async getMessages(@Param('workspaceId') workspaceId: string) {
        return await this.messageService.getMessagesByWorkspace(workspaceId);
    }

    @Post()
    @UseInterceptors(FileInterceptor('filePath', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
    }))
    @UseGuards(AuthGuard, UserGuard)
    addMessage(@Body() messageDto: MessageDto, @Req() req: any, @UploadedFile() filePath: Express.Multer.File) {
        if (filePath) {
            messageDto.filePath = filePath.originalname;
        }
        return this.messageService.addMessage(messageDto, req);
    }

    @Delete(':messageId')
    @UseGuards(AuthGuard, UserGuard)
    deleteMessage(@Param('messageId') messageId: mongoose.Schema.Types.ObjectId) {
        return this.messageService.deleteMessage(messageId);
    }

    @Put(':messageId')
    @UseInterceptors(FileInterceptor('filePath', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
    }))
    @UseGuards(AuthGuard, UserGuard)
    editMessage(@Param('messageId') messageId: mongoose.Schema.Types.ObjectId, @Body() updateMessageDto: UpdateMessageDto, @UploadedFile() filePath: Express.Multer.File) {
         if (filePath) {
            updateMessageDto.filePath = filePath.originalname;
        }
        return this.messageService.editMessage(messageId, updateMessageDto);
    }
}