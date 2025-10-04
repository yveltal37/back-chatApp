import { Injectable } from '@nestjs/common';
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

    async createChat(name: string, userIds: number[], isGroup: boolean = false) {
        const chat = this.chatRepo.create({ name, isGroup });
        const savedChat = await this.chatRepo.save(chat);

        const chatUsers = userIds.map(userId => {
            const chatUser = new ChatUserEntity();
            chatUser.chat = savedChat;
            chatUser.user = { id: userId } as UserEntity;
            return chatUser;
        });

        await this.chatUserRepo.save(chatUsers);

        return savedChat;
    }

    async getChatsForUser(userId: number) {
    return this.chatRepo.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.chatUsers', 'chatUser')
      .leftJoinAndSelect('chatUser.user', 'user')
      .leftJoinAndSelect('chat.messages', 'message')
      .where('user.id = :userId', { userId })
      .getMany();
  }

}
