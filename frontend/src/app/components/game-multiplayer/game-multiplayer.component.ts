import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketIOService } from '../../core/services/socket-io.service.js';

@Component({
	selector: 'app-game-multiplayer',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './game-multiplayer.component.html',
	styleUrls: ['./game-multiplayer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMultiplayerComponent {
	public rooms = this.socketService.rooms;

	constructor(
		private socketService: SocketIOService,
		private router: Router
	) {}

	public createRoom() {
		const roomData = {
			name: `Room ${Date.now()}`,
			mode: 'Classic',
			maxPlayers: 4,
		};
		this.socketService
			.createRoom(roomData)
			.then(room => {
				console.log(`Created room: ${room.name}`);
				this.router.navigate(['/game', 'room', room.id]);
			})
			.catch(error => {
				console.error('Error creating room:', error);
			});
	}

	public joinRoom(roomId: string) {
		this.socketService
			.joinRoom(roomId)
			.then(room => {
				console.log(`Joined room: ${room.name}`);
				this.router.navigate(['/game', 'room', room.id]);
			})
			.catch(error => {
				console.error('Error joining room:', error);
			});
	}

	public trackByRoomId(index: number, room: any): string {
		return room.id;
	}
}
