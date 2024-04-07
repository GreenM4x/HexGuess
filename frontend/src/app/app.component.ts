import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketIOService } from './core/services/socket-io.service';
import { environment } from '../environments/environment';
import { ServiceWorkerUpdateService } from './core/services/worker-update.service.js';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [CommonModule, HeaderComponent, RouterOutlet, HttpClientModule],
})
export class AppComponent implements OnInit {
	@ViewChild('dialog', {static: true}) dialog: ElementRef<HTMLDialogElement>;
	public isConnected = this.socketIOService.isConnected;
	public messages = this.socketIOService.messages;

	public get connectedUsers() {
		return this.socketIOService.connectedUsers;
	}

	constructor(
		private http: HttpClient,
		private socketIOService: SocketIOService,
		private workerUpdateService: ServiceWorkerUpdateService
	) {
		this.http
			.get<{ message: string }>('/api/hello')
			.subscribe((data: { message: string }) => {
				console.log(data);
			});
	}

	ngOnInit() {
		this.workerUpdateService.checkForUpdate().subscribe(() => {
			this.dialog.nativeElement.showModal();
		});
		this.socketIOService.connect(
			environment.production ? window.location.origin : 'http://localhost:3000'
		);
	}

	reloadPage() {
		this.dialog.nativeElement.close();
		window.location.reload();
	}
}
