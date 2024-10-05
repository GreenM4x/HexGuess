import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-game-multiplayer',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './game-multiplayer.component.html',
	styleUrl: './game-multiplayer.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameMultiplayerComponent {
	public rooms = [
		{
			id: 1,
			name: 'Room 1',
			creator: 'User 1',
			mode: 'Classic',
			maxPlayers: 4,
			connectedPlayers: ['User 1'],
		},
		{
			id: 2,
			name: 'Room 2',
			creator: 'User 2',
			mode: 'Classic',
			maxPlayers: 4,
			connectedPlayers: ['User 2', 'User 3'],
		},
	];

	public joinRoom(roomId: number) {
		console.log(`Joining room ${roomId}`);
	}
}
