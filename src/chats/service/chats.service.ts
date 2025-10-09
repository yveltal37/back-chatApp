import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from '../../entities/chat.entity';
import { ChatUserEntity } from '../../entities/chat-user.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(ChatEntity)
        private readonly chatRepo: Repository<ChatEntity>,
        @InjectRepository(ChatUserEntity)
        private readonly chatUserRepo: Repository<ChatUserEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async createChat(name: string, userId: number, isGroup: boolean = false) {
        const chat = this.chatRepo.create({ name, isGroup }); 
        const savedChat = await this.chatRepo.save(chat);
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) { 
            throw new BadRequestException('Creator user not found'); 
        }

        const chatUser = new ChatUserEntity();
        chatUser.chat = savedChat;
        chatUser.user=  user ;
            
        await this.chatUserRepo.save(chatUser);
        return savedChat;
    }

    async getChatsForUser(userId: number) {
        const chatConnections = await this.chatUserRepo.find({where: { user: { id: userId } },
            relations: ['chat'],});
        return chatConnections.map(connection => connection.chat);
    }

    async addUser(chatId: number, username: string) {
        const chat = await this.chatRepo.findOneBy({ id: chatId });
        if (!chat) {
            throw new BadRequestException('Chat not found');
        }
        if (!chat.isGroup && chat.participants.length === 2) {
            throw new BadRequestException('Cannot add users to a private chat'); 
        }

        const user = await this.userRepo.findOne({ where: { username: username }});
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const existingParticipant = await this.chatUserRepo.findOne({
          where: {chat: { id: chatId }, user: { id: user.id }}});
        if (existingParticipant) {
            throw new BadRequestException('User is already a participant in this chat');
        }

        const chatUser = new ChatUserEntity();
        chatUser.chat = chat;
        chatUser.user=  user ;  
        await this.chatUserRepo.save(chatUser);
    }
}
