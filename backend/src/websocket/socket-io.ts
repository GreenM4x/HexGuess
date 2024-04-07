import { Server, Socket } from 'socket.io';
import { handleIncomingMessage } from './messageHandler.js';

interface ConnectedUser {
	userId: string;
	username: string;
	sessionId?: string;
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
				maxDisconnectionDuration: 2 * 60 * 1000,
			},
			path: '/api/ws',
		});
		this.io.on('connection', this.connection.bind(this));
	}

	async connection(socket: Socket) {
		console.log(`🤖 Socket.IO connected`);

		await this.updatedConnectedUsers();

		socket.on('user_connect', async (connectedUser: ConnectedUser) => {
			console.log(`➕ User ${connectedUser.username} connected`);
			this.connectedUsers = this.connectedUsers.map((user) => {
				if (user.sessionId === socket.id) {
					user.username = connectedUser.username;
					user.userId = connectedUser.userId;
				}
				return user;
			});
			await this.updatedConnectedUsers(true);
		});

		socket.on('message', (data: any) => {
			handleIncomingMessage(this, data, socket.id);
		});

		socket.on('disconnect', async () => {
			const disconnectedUser = this.connectedUsers.find(
				(user) => user.sessionId === socket.id
			);
			console.log(`➖ User ${disconnectedUser.username} disconnected`);
			await this.updatedConnectedUsers(true);
		});
	}

	private async updatedConnectedUsers(disconnectOld: boolean = false) {
		const allSockets = await this.io.fetchSockets();
		allSockets.forEach((socket) => {
			const connectedUser = this.connectedUsers.find((user) => user.sessionId === socket.id);
			if (!connectedUser) {
				this.connectedUsers.push({
					userId: '',
					username: '',
					sessionId: socket.id,
				});
			}

			// Kinda weird workaround to make sure sessions that's aren't connected to a user are disconnected
			if (disconnectOld && connectedUser && connectedUser.username === '') {
				console.log(`🔌 Disconnecting old session ${socket.id}`);
				socket.disconnect();
			}
		});
		this.connectedUsers = this.connectedUsers.filter((user) =>
			allSockets.some((socket) => socket.id === user.sessionId)
		);
		this.io.emit('user_update', this.connectedUsers);
	}

	sendMessage(data: any, event: string) {
		this.io.emit(event, data);
	}
}
