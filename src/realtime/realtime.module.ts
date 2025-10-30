import { Module } from '@nestjs/common';
import { RealtimeGateway } from './gateway/realtime.gateway';
import { MessageModule } from '../message/message.module'; 
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
    imports: [AuthenticationModule, MessageModule], 
    providers: [RealtimeGateway],
})
export class RealtimeModule {}
