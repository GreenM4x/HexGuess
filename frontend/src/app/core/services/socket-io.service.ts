import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class SocketIOService {
    private socket = signal<Socket | null>(null);
    private url = signal<string>('');
    public messages = signal<any[]>([]);
    public connectedUsers = signal<string[]>([]);
    public currentUser = signal<{userId: string, username: string}>(null);

    public get isConnected(): boolean {
        const currentSocket = this.socket();
        return currentSocket !== null && currentSocket.connected;
    }

    constructor(private firebaseService: FirebaseService) { }

    public connect(url: string): void {
        this.url.set(url);
        this.socket.set(io(url, { path: '/api/ws' }));

        this.socket().on('connect', async () => {
            console.log("recovered?", this.socket().recovered);

            if(!this.socket()?.id) return console.log('Socket.IO connection is not open.');
            const user = await firstValueFrom(this.firebaseService.user$);
            let userObj: { userId: string, username: string, sessionId?: string };
            if (user && !user?.displayName) {
                const username = await this.firebaseService.getUsernameFromUserId(user.uid);
                userObj = { userId: user.uid, username, sessionId: Date.now().toString() };
                this.sendMessage('user_connect', userObj);
            } else if (user?.displayName) {
                userObj = { userId: user.uid, username: user.displayName, sessionId: Date.now().toString()};
                this.sendMessage('user_connect', userObj);
            } else {
                userObj = { userId: Date.now().toString(), username: 'Anonymous User 👀', sessionId: Date.now().toString() };
                this.sendMessage('user_connect', userObj);
            }
            this.currentUser.set(userObj);
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

    public sendMessage(event: string, data: any): void {
        if (this.isConnected) {
            this.socket().emit(event, data);
        } else {
            console.error('Socket.IO connection is not open.');
        }
    }

    public updateConnectedUsers(connectedUsers: { uid: string, username: string }[]) {
        this.connectedUsers.set(connectedUsers.map(user => user.username));
    }
}