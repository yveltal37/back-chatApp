import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { MessageService } from '../service/message.service';
import  { MessageDto } from '../mess-dto'

@Controller('message')
export class MessageController {
    constructor(private readonly messagesService: MessageService) {}

    @Post(':chatId') 
    async sendMessage(
        @Param('chatId', ParseIntPipe) chatId: number,
        @Body() body: MessageDto,
    ) { 
        return this.messagesService.SendMessage(
            chatId,
            body.senderId,
            body.content
        );
    }

    @Get('history/:chatId')
    async getHistory(
        @Param('chatId', ParseIntPipe) chatId: number,
    ) {        
        return this.messagesService.getChatHistory(chatId);
    }
}
