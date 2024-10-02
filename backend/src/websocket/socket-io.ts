import { Server, Socket } from 'socket.io';
import { handleIncomingMessage } from './messageHandler.js';

interface ConnectedUser {
	userId: string;
	username: string;
	sessionId: string;
}

export default class SocketIOManager {
	io: Server;
	connectedUsers: Map<string, ConnectedUser> = new Map();

	constructor(server: any) {
		this.io = new Server(server, {
			cors: {
				origin: process.env.ENV === 'dev' ? ['http://localhost:4200'] : false,
			},
			connectionStateRecovery: {
				maxDisconnectionDuration: 2 * 60 * 1000,
			},
			path: '/api/ws',
		});

		this.io.on('connection', this.handleConnection.bind(this));
	}

	private handleConnection(socket: Socket) {
		console.log(`🤖 Socket.IO connected: ${socket.id}`);

		socket.on('user_connect', (connectedUser: ConnectedUser) => {
			if(this.connectedUsers.has(socket.id)) {
				const existingUser = this.connectedUsers.get(socket.id);
				console.log(`🔄 User ${existingUser.username} is now ${connectedUser.username}`);
			} else {
				console.log(`➕ User ${connectedUser.username} connected`);
			}
			this.connectedUsers.set(socket.id, {
				...connectedUser,
				sessionId: socket.id,
			});
			this.updateConnectedUsers();
		});

		socket.on('message', (data: any) => {
			handleIncomingMessage(this, data, socket.id);
		});

		socket.on('disconnect', () => {
			const disconnectedUser = this.connectedUsers.get(socket.id);
			if (disconnectedUser) {
				console.log(`➖ User ${disconnectedUser.username} disconnected`);
				this.connectedUsers.delete(socket.id);
			} else {
				console.log(`➖ A user disconnected before completing login.`);
			}
			this.updateConnectedUsers();
		});
	}

	private updateConnectedUsers() {
		this.io.emit(
			'user_update',
			Array.from(this.connectedUsers.values()).map((user) => ({
				username: user.username,
			}))
		);
	}

	sendMessage(event: string, data: any) {
		this.io.emit(event, data);
	}
}
