import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ChatUserEntity } from './chat-user.entity';

@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  isGroup: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MessageEntity, message => message.chat)
  messages: MessageEntity[];

  @OneToMany(() => ChatUserEntity, chatUser => chatUser.chat)
  participants: ChatUserEntity[];
}