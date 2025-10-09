import { Module } from '@nestjs/common';
import { RealtimeGateway } from './gateway/realtime.gateway';
import { MessageModule } from '../message/message.module'; 

@Module({
    imports: [MessageModule], 
    providers: [RealtimeGateway],
})
export class RealtimeModule {}
