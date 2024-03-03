import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameModeEnum } from '../../core/config/game.config';

@Component({
	selector: 'app-game-select',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './game-select.component.html',
	styleUrl: './game-select.component.scss',
})
export class GameSelectComponent {
	public gameModes = GameModeEnum;

	constructor(private router: Router) {}

	public startGame(gameMode: GameModeEnum) {
		this.router.navigate([`game/${gameMode}`]);
	}
}
