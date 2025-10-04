import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsService } from './service/chats.service';
import { ChatsController } from './controller/chats.controller';
import { ChatEntity } from '../entities/chat.entity';
import { ChatUserEntity } from '../entities/chat-user.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, ChatUserEntity, UserEntity]),
  ],
  providers: [ChatsService],
  controllers: [ChatsController]
})
export class ChatsModule {}
