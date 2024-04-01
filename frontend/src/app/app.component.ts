import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketIOService } from './core/services/socket-io.service';
import { environment } from '../environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [CommonModule, HeaderComponent, RouterOutlet, HttpClientModule],
})
export class AppComponent implements OnInit, OnDestroy {

	public isConnected = this.socketIOService.isConnected;
	public messages = this.socketIOService.messages;

	public get connectedUsers() {
		return this.socketIOService.connectedUsers;
	}

	constructor(private http: HttpClient, private socketIOService: SocketIOService) {
		this.http.get<{ message: string }>('/api/hello').subscribe((data: { message: string }) => {
			console.log(data);
		});
	}

	ngOnInit() {
		this.socketIOService.connect(environment.production ? window.location.origin : 'http://localhost:3000');
		window.onbeforeunload = () => this.ngOnDestroy();
	}

	ngOnDestroy() {
		this.socketIOService.disconnect();
	}
}