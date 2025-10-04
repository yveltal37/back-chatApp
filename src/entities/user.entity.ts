import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ChatUserEntity } from './chat-user.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MessageEntity, message => message.sender)
  messages: MessageEntity[];

  @OneToMany(() => ChatUserEntity, chatUser => chatUser.user)
  chatConnections: ChatUserEntity[];
}
