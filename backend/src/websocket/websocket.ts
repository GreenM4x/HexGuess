import WebSocket, { WebSocketServer } from 'ws';
import { WSMessageType } from '../models/WebSocketModels';
import { handleIncomingMessage } from './messageHandler';

interface ConnectedUser {
    userId: string;
    username: string;
    ws: WebSocket;
}

export default class WebSocketLogs extends WebSocketServer {
    connectedUsers: ConnectedUser[] = [];
    webSockets: WebSocket[] = [];
    
    constructor(port: number) {
        super({ port: port });
        this.on('connection', this.connection);

        console.log(`The WebSocket server is running on ${port}`);
    }

    connection(ws: WebSocket) {
		console.log(`New connection established.`);

        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);
            switch (parsedMessage.type) {
                case 'connection':
                    const { userId, username } = parsedMessage.data;
                    const connectedUser: ConnectedUser = {
                        userId: userId || 'anonymous',
                        username: username,
                        ws: ws,
                    };
                    this.connectedUsers.push(connectedUser);
                    this.sendMessage(this.connectedUsers, WSMessageType.USER_UPDATE);
                    break;
                case 'disconnection':
                    const disconnectedUser = this.connectedUsers.find((user) => user.ws === ws);
                    if (disconnectedUser) {
                        this.connectedUsers = this.connectedUsers.filter((user) => user.ws !== ws);
                        this.sendMessage(this.connectedUsers, WSMessageType.USER_UPDATE);
                    }
                    break;
                default:
                    handleIncomingMessage(this, parsedMessage, userId);
            }
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
            this.connectedUsers = this.connectedUsers.filter((user) => user.ws !== ws);
        });

        ws.onerror = (err) => {
            console.log('Error: %s', err);
        };
    }

    sendMessage(data: any, messageType: WSMessageType) {
        const message = JSON.stringify({ data: data, type: messageType });
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}