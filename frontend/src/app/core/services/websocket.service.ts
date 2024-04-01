// websocket.service.ts

import { Injectable, signal } from '@angular/core';
import { Observable, Subject, firstValueFrom, lastValueFrom } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket = signal<WebSocket | null>(null);
    private url = signal<string>('');
    public messages = signal<any[]>([]);
    public connectedUsers = signal<string[]>([]);

    public get isConnected(): boolean {
        const currentSocket = this.socket();
        return currentSocket !== null && currentSocket.readyState === WebSocket.OPEN;
    }

    constructor(private firebaseService: FirebaseService) { }

    public connect(url: string): void {
        this.url.set(url);
        this.socket.set(new WebSocket(url));

        this.socket().onopen = async (event) => {
            const user = await firstValueFrom(this.firebaseService.user$);
            if (user && !user?.displayName) {
                const username = await this.firebaseService.getUsernameFromUserId(user.uid);
                this.sendMessage({ type: 'connection', data: { userId: user.uid, username } });
            } else if (user?.displayName) {
                this.sendMessage({ type: 'connection', data: { userId: Date.now, username: user.displayName } });
            } else {
                this.sendMessage({ type: 'connection', data: { userId: Date.now, username: 'Anonymous User 👀' } });
            }
        };


        this.socket().onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case 'log':
                    console.log('New log:', message.data);
                    this.messages.update((messages) => [...messages, message.data]);
                    break;
                case 'user_update':
                    this.updateConnectedUsers(message.data);
                    break;
                default:
                    console.log('Unknown message type:', message.type);
            }
        };

        this.socket().onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            this.socket.set(null);
        };

        this.socket().onerror = (event) => {
            console.error('WebSocket error:', event);
        };
    }

    public disconnect(): void {
        if (this.socket()) {
            this.sendMessage({ type: 'disconnection' });
            this.socket()!.close();
            this.socket.set(null);
        }
    }

    public sendMessage(message: any): void {
        if (this.isConnected) {
            this.socket()!.send(JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not open.');
        }
    }

    public updateConnectedUsers(connectedUsers: {uid: string, username: string}[]) {
        this.connectedUsers.set(connectedUsers.map(user => user.username));
    }
}