import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ChatsService } from '../service/chats.service';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService) {}

    @Post()
    async createChat(
        @Body('name') name: string,
        @Body('userId', ParseIntPipe) userId: number,
        @Body('isGroup') isGroup: boolean = false,
    ) {
        return this.chatService.createChat(name, userId, isGroup);
    }

    @Get(':userId')
    async getChatsForUser(@Param('userId') userId: number) {
        return this.chatService.getChatsForUser(userId);
    }

    @Patch(':chatId/user')
    async addUser(
        @Param('chatId', ParseIntPipe) chatId: number,
        @Body('username') username: string,
    ) {
        return this.chatService.addUser(chatId, username);
    }
}
