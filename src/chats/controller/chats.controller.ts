import { Controller, Post, Body, Req, Get, Param, ParseIntPipe, Patch, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/jwt-auth.guard';
import { ChatsService } from '../service/chats.service';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatService: ChatsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createChat(@Req() req, @Body('name') name: string, @Body('isGroup') isGroup: boolean = false) {
        return this.chatService.createChat(name, req.user.id, isGroup);
    }

    @Get('my-chats')
    @UseGuards(JwtAuthGuard)
    async getChatsForUser(@Req() req) {
        return this.chatService.getChatsForUser(req.user.id);
    }

    @Patch(':chatId')
    @UseGuards(JwtAuthGuard)
    async addUser(
        @Param('chatId', ParseIntPipe) chatId: number,
        @Body('username') username: string,
    ) {
        return this.chatService.addUser(chatId, username);
    }

    @Delete(':chatId/leave')
    @UseGuards(JwtAuthGuard)
    async leaveChat(
        @Param('chatId', ParseIntPipe) chatId: number,
        @Req() req
    ) {
        return this.chatService.leaveChat(chatId, req.user.id);
    }
}
