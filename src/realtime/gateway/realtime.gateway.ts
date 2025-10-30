import { SubscribeMessage, WebSocketGateway, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { MessageService } from '../../message/service/message.service'; 
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173',
    },
})

export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    readonly server: Server;

    constructor(
        private readonly messagesService: MessageService,
        private readonly jwtService: JwtService
    ) {}

    handleConnection(client: Socket) {
        const token = client.handshake.auth.token;
        if (!token) {
            client.disconnect();
            return;
        }

        try {
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            console.log(`Socket Client connected: ${client.id}`);
        } catch (err) {
            console.log(`Socket connection rejected for ${client.id}: Invalid token`);
            client.disconnect();
        }
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
    async handleSendMessage(@MessageBody() payload: { chatId: number, content: string },
    @ConnectedSocket() client: Socket
) {
        const senderId = client.data.user.sub;
        const savedMessage = await this.messagesService.SendMessage(
            payload.chatId,
            senderId,
            payload.content
        );

        this.server.to(payload.chatId.toString())
        .emit('newMessage', savedMessage);

        console.log(`Message received and broadcasted in room ${payload.chatId}`);
    }
}
