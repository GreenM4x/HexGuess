import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebSocketService } from './core/services/websocket.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [CommonModule, HeaderComponent, RouterOutlet, HttpClientModule],
})
export class AppComponent implements OnInit, OnDestroy {

	public isConnected = this.webSocketService.isConnected;
	public messages = this.webSocketService.messages;

	public get connectedUsers() {
		return this.webSocketService.connectedUsers;
	}

	constructor(private http: HttpClient, private webSocketService: WebSocketService) {
		this.http.get<{ message: string }>('/api/hello').subscribe((data: { message: string }) => {
			console.log(data);
		});
	}

	ngOnInit() {
		this.webSocketService.connect('ws://localhost:8080');
	}

	ngOnDestroy() {
		this.webSocketService.disconnect();
	}

	sendMessage(message: string) {
		const messageObject = {
			type: 'log',
			data: { text: message }
		};
		this.webSocketService.sendMessage(messageObject);
	}
}