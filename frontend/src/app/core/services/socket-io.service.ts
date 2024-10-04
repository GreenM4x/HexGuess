import { Injectable, signal, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { FirebaseService } from './firebase.service';
import { User } from 'firebase/auth';
import { Subscription, firstValueFrom } from 'rxjs';

interface ConnectedUser {
	userId: string;
	username: string;
	sessionId?: string;
	clientCount?: number;
}

interface Message {
	type: 'log'; // TODO: enum, more types
	data: string;
}

@Injectable({
	providedIn: 'root',
})
export class SocketIOService implements OnDestroy {
	private socket = signal<Socket | null>(null);
	private url = signal<string>('');
	public messages = signal<Message[]>([]);
	public connectedUsers = signal<ConnectedUser[]>([]);
	public currentUser = signal<ConnectedUser | null>(null);

	private userSubscription: Subscription;

	public get isConnected(): boolean {
		const currentSocket = this.socket();
		return currentSocket !== null && currentSocket.connected;
	}

	constructor(private firebaseService: FirebaseService) {
		window.addEventListener('beforeunload', this.handleBeforeUnload);
		this.userSubscription = this.firebaseService.user$.subscribe(async user => {
			if (this.isConnected) {
				const connectedUser = await this.getConnectedUser(user);
				const previousUser = this.currentUser();
				this.setCurrentUser(connectedUser);

				// Only send 'user_connect' if the user has changed
				if (
					!previousUser ||
					previousUser.userId !== connectedUser.userId ||
					previousUser.username !== connectedUser.username
				) {
					this.sendUserConnectMessage(connectedUser);
				}
			}
		});
	}

	private handleBeforeUnload = () => {
		if (this.socket()) {
			this.socket().disconnect();
		}
	};

	public async connect(url: string): Promise<void> {
		this.url.set(url);
		const user = await firstValueFrom(this.firebaseService.user$);
		this.socket.set(
			io(url, {
				path: '/api/ws',
				reconnectionAttempts: 5,
				reconnectionDelay: 2000,
			})
		);

		const socket = this.socket();

		if (!socket) {
			console.warn('Socket.IO instance is not initialized.');
			return;
		}

		socket.on('connect', async () => {
			console.log('Socket.IO connected:', socket.id);

			try {
				const connectedUser = await this.getConnectedUser(user);
				this.setCurrentUser(connectedUser);
				this.sendUserConnectMessage(connectedUser);
			} catch (error) {
				console.error('Error handling socket connection:', error);
			}
		});

		socket.on('message', (data: Message) => {
			console.log('New message:', data);
			this.messages.update(messages => [...messages, data]);
		});

		socket.on('user_update', (connectedUsers: ConnectedUser[]) => {
			this.updateConnectedUsers(connectedUsers);
		});

		socket.on('disconnect', () => {
			console.log('Socket.IO disconnected');
		});

		socket.on('error', (error: any) => {
			console.error('Socket error:', error);
		});
	}

	public updateConnectedUsers(connectedUsers: ConnectedUser[]) {
		this.connectedUsers.set(connectedUsers);
	}

	private async getConnectedUser(user?: User | null): Promise<ConnectedUser> {
		let username: string;
		let userId: string;

		if (user) {
			userId = user.uid;
			username =
				user.displayName ||
				(await this.firebaseService.getUsernameFromUserId(user.uid));
		} else {
			userId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
			username = `Guest_${Math.floor(Math.random() * 10000)}`;
		}

		return {
			userId,
			username,
		};
	}

	private sendUserConnectMessage(connectedUser: ConnectedUser) {
		this.sendMessage('user_connect', connectedUser);
	}

	private setCurrentUser(connectedUser: ConnectedUser) {
		this.currentUser.set(connectedUser);
	}

	private sendMessage(event: string, data: any) {
		const socket = this.socket();
		if (socket && socket.connected) {
			socket.emit(event, data);
		} else {
			console.warn('Socket is not connected. Cannot send message.');
		}
	}

	ngOnDestroy() {
		if (this.socket()) {
			this.socket().disconnect();
			this.socket.set(null);
		}
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
		window.removeEventListener('beforeunload', this.handleBeforeUnload);
	}
}
