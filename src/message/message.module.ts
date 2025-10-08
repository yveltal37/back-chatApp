import { Module } from '@nestjs/common';
import { MessageService } from './service/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './controller/message.controller';
import { MessageEntity } from '../entities/message.entity'; 
import { ChatEntity } from '../entities/chat.entity';
import { UserEntity } from '../entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MessageEntity,
            ChatEntity,
            UserEntity
        ]),
    ],
  providers: [MessageService],
  controllers: [MessageController]
})
export class MessageModule {}
