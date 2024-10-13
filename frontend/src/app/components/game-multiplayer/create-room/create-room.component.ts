import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameModeEnum } from '../../../core/config/game.config.js';
import { Router } from '@angular/router';

@Component({
	selector: 'app-create-room',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './create-room.component.html',
	styleUrl: './create-room.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRoomComponent {
	constructor(private router: Router) {}

	public startGame(gameMode: GameModeEnum) {
		this.router.navigate([`game/${gameMode}`]);
	}
}
