import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatsService } from '../service/chats.service';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService) {}

    @Post()
    async createChat(
        @Body('name') name: string,
        @Body('userIds') userIds: number[],
        @Body('isGroup') isGroup: boolean = false,
    ) {
        return this.chatService.createChat(name, userIds, isGroup);
    }

    @Get(':userId')
    async getChatsForUser(@Param('userId') userId: number) {
        return this.chatService.getChatsForUser(userId);
    }
}
