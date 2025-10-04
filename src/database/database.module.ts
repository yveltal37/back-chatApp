import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ChatEntity } from '../entities/chat.entity';
import { MessageEntity } from '../entities/message.entity';
import { ChatUserEntity } from '../entities/chat-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'chatapp.db',
      entities: [
        UserEntity,
        ChatEntity,
        MessageEntity,
        ChatUserEntity
      ],
      synchronize: true,

    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
