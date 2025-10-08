import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../../entities/message.entity'; 
import { ChatEntity } from '../../entities/chat.entity'; 
import { UserEntity } from '../../entities/user.entity'

@Injectable()
export class MessageService {
        constructor(
        @InjectRepository(MessageEntity)
        private messageRepo: Repository<MessageEntity>,
        @InjectRepository(ChatEntity)
        private chatRepo: Repository<ChatEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) {}

    async SendMessage(chatId: number, senderId: number, content: string, ) {
        const chat = await this.chatRepo.findOneBy({ id: chatId });
        const sender = await this.userRepo.findOneBy({ id: senderId });
        if (!chat) {
            throw new NotFoundException('Chat not found.');
        }
        if (!sender) {
            throw new NotFoundException('Sender user not found.');
        }
        if (!content || content.trim() === '') {
            throw new BadRequestException('Message content cannot be empty.');
        }

        const newMessage = this.messageRepo.create({
            content,
            chat: chat,
            sender: sender,
        });
        return this.messageRepo.save(newMessage);
    }

    async getChatHistory(chatId: number) {
        return this.messageRepo.find({
            where: { chat: { id: chatId } },
            relations: ['sender'], 
            order: { createdAt: 'ASC',},
        });
    }
}
