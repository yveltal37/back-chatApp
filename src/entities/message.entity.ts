import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { ChatEntity } from './chat.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => ChatEntity, chat => chat.messages, { onDelete: 'CASCADE' })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, user => user.messages, { onDelete: 'SET NULL' })
  sender: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
