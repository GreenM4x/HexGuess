import { Server, Socket } from 'socket.io';
import { handleIncomingMessage } from './messageHandler.js';

interface ConnectedUser {
    userId: string;
    username: string;
    sessionId?: string;
    updatedAt: number;
    clientCount: number;
}

export default class SocketIOLogs {
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
        this.io.on('connection', this.connection.bind(this));
    }

    connection(socket: Socket) {
        console.log(`🤖 Socket.IO connected`);
        socket.emit('initial_sync', this.connectedUsers); 
        socket.on('user_connect', async (connectedUser: ConnectedUser) => {
            connectedUser.updatedAt = Date.now();
            if(!connectedUser.clientCount) {
                connectedUser.clientCount = 1;
                console.log(`➕ User ${connectedUser.username} connected`);
            } else {
                connectedUser.clientCount++;
                console.log(`🔄 User ${connectedUser.username} has now ${connectedUser.clientCount} clients`);
            }
            this.syncConnectedUsers(connectedUser);
        });

        socket.on('user_disconnect', (connectedUser: ConnectedUser) => {
            const disconnectedUser = this.connectedUsers.find((user) => user.username === connectedUser?.username);
            if (disconnectedUser) {
                disconnectedUser.clientCount--;
                if (disconnectedUser.clientCount === 0) {
                    this.connectedUsers = this.connectedUsers.filter((user) => user.username !== connectedUser.username);
                    this.io.emit('user_update', this.connectedUsers);
                    console.log(`➖ User ${disconnectedUser.username} disconnected`);
                } else {
                    this.syncConnectedUsers(disconnectedUser);
                }
            }
        });

        socket.on('message', (data: any) => {
            handleIncomingMessage(this, data, socket.id);
        });

        socket.on('disconnect', () => {
            console.log('🤖 Socket.IO disconnected');
        });
    }

    sendMessage(data: any, event: string) {
        this.io.emit(event, data);
    }

    private syncConnectedUsers(user: ConnectedUser) {
        const userIndex = this.connectedUsers.findIndex((u) => u.username === user.username);
        if (userIndex !== -1) {
            const existingUser = this.connectedUsers[userIndex];
            if (user.updatedAt > existingUser.updatedAt) {
                this.connectedUsers[userIndex] = user;
                this.io.emit('user_update', this.connectedUsers);
            }
        } else {
            this.connectedUsers.push(user);
            this.io.emit('user_update', this.connectedUsers);
        }
    }


}