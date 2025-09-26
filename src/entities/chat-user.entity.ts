import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ChatEntity } from './chat.entity';

@Entity('chat_users')
export class ChatUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatEntity, chat => chat.participants, { onDelete: 'CASCADE' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, user => user.chatConnections, { onDelete: 'CASCADE' })
  user: UserEntity;
}
