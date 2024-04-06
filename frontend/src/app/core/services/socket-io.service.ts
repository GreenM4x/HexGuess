import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { FirebaseService } from './firebase.service';
import { User } from 'firebase/auth';

interface ConnectedUser {
    userId: string,
    username: string,
    sessionId?: string,
    updatedAt?: number,
    clientCount?: number
}
@Injectable({
    providedIn: 'root'
})
export class SocketIOService {
    private socket = signal<Socket | null>(null);
    private url = signal<string>('');
    public messages = signal<any[]>([]);
    public connectedUsers = signal<ConnectedUser[]>([]);
    public currentUser = signal<ConnectedUser>(null);

    public get isConnected(): boolean {
        const currentSocket = this.socket();
        return currentSocket !== null && currentSocket.connected;
    }

    constructor(private firebaseService: FirebaseService) { }

    public connect(url: string): void {
        this.url.set(url);
        this.socket.set(io(url, { path: '/api/ws' }));

        this.socket().on('connect', async () => {
            console.log('Socket.IO connection recovered?', this.socket().recovered);

            if (!this.socket().id) {
                console.log('Socket.IO connection is not open.');
                return;
            }

            try {
                const user = await this.getUser();
                const connectedUser = await this.getConnectedUser(user);
                this.sendUserConnectMessage(connectedUser);
                this.setCurrentUser(connectedUser);
            } catch (error) {
                console.error('Error handling socket connection:', error);
            }
        });

        this.socket().on('initial_sync', (connectedUsers: ConnectedUser[]) => {
            this.connectedUsers.set(connectedUsers);
          });

        this.socket().on('message', (data: any) => {
            console.log('New message:', data);
            this.messages.update((messages) => [...messages, data]);
        });

        this.socket().on('user_update', (connectedUsers: any[]) => {
            this.updateConnectedUsers(connectedUsers);
        });

        this.socket().on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });


    }

    public disconnect(): void {
        if (this.socket()) {
            console.log('here :>> ');
            this.socket().emit('user_disconnect', this.currentUser());
            this.socket()!.disconnect();
            this.socket.set(null);
        }
    }

    public updateConnectedUsers(connectedUsers: ConnectedUser[]) {
        this.connectedUsers.set(connectedUsers);
    }

    private async getUser(): Promise<User> {
        return firstValueFrom(this.firebaseService.user$);
    }

    private async getConnectedUser(user?: User): Promise<ConnectedUser> {
        let username: string;
        if (user) {
            username = user?.displayName || await this.firebaseService.getUsernameFromUserId(user?.uid);
        }

        const existingUser = this.connectedUsers().find((u) => u.username === username);
        if(existingUser) return existingUser;
        
        return {
            userId: user?.uid || Date.now().toString(),
            username: username || `Anonymous User ${Date.now()}`,
            sessionId: Date.now().toString(),
        };
    }

    private sendUserConnectMessage(connectedUser: ConnectedUser) {
        this.sendMessage('user_connect', connectedUser);
    }

    private setCurrentUser(connectedUser: ConnectedUser) {
        this.currentUser.set(connectedUser);
    }

    private sendMessage(event: string, data: any) {
        this.socket().emit(event, data);
    }
}