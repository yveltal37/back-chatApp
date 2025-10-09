import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageService } from '../../message/service/message.service'; 

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173',
    },
})

export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    readonly server: Server;

    constructor(private readonly messagesService: MessageService) {}

    handleConnection(client: Socket) {
        console.log(`Socket Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Socket Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
        client.rooms.forEach(room => {
            if (room !== client.id) {
                client.leave(room);
            }
        });
        client.join(chatId);
        console.log(`Client ${client.id} joined room ${chatId}`);
    }
    
    @SubscribeMessage('sendMessage')
    async handleSendMessage(@MessageBody() payload: { chatId: number, senderId: number, content: string }) {
        const savedMessage = await this.messagesService.SendMessage(
            payload.chatId,
            payload.senderId,
            payload.content
        );

        this.server.to(payload.chatId.toString())
        .emit('newMessage', savedMessage);

        console.log(`Message received and broadcasted in room ${payload.chatId}`);
    }
}
