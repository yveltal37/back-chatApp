import { Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MessageService } from '../service/message.service';
import  { MessageDto } from '../mess-dto'
import { JwtAuthGuard } from '../../authentication/jwt-auth.guard';

@Controller('message')
export class MessageController {
    constructor(private readonly messagesService: MessageService) {}

   @Post(':chatId') 
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    async getHistory(
        @Param('chatId', ParseIntPipe) chatId: number,
    ) {        
        return this.messagesService.getChatHistory(chatId);
    }
}
