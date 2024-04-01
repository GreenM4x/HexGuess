import { Server, Socket } from 'socket.io';
import { handleIncomingMessage } from './messageHandler';

interface ConnectedUser {
    userId: string;
    username: string;
    sessionId?: string;
}

export class SocketIOLogs {
    io: Server;
    connectedUsers: ConnectedUser[] = [];

    constructor(server: any) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.ENV === 'dev' ? ['http://localhost:4200'] : false,
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2*60*1000,
            },
            path: '/api/ws',
        });
        console.log(process.env.ENV);
        this.io.on('connection', this.connection.bind(this));
    }

    connection(socket: Socket) {
        console.log(`🤖 Socket.IO connected`);

        socket.on('user_connect', (connectedUser: ConnectedUser) => {
            this.connectedUsers.push(connectedUser);
            this.io.emit('user_update', this.connectedUsers);
            console.log(`➕ User ${connectedUser.username} connected`);
        });

        socket.on('user_disconnect', (user: ConnectedUser) => {
            this.connectedUsers = this.connectedUsers.filter((connectedUser) => connectedUser.sessionId !== user.sessionId);
            this.io.emit('user_update', this.connectedUsers);
            console.log(`➖ User ${user.username} disconnected`);
        });

        socket.on('message', (data: any) => {
            console.log('data :>> ', data);
            handleIncomingMessage(this, data, socket.id);
        });

        socket.on('disconnect', () => {
            console.log('🤖 Socket.IO disconnected');
        });
    }

    sendMessage(data: any, event: string) {
        this.io.emit(event, data);
    }
}