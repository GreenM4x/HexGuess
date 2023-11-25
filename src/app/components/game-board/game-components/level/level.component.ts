import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameStateService } from '@core/services/game-state.service';

@Component({
	selector: 'app-level',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './level.component.html',
	styleUrl: './level.component.scss',
})
export class LevelComponent {
	public get currentlevel() {
		return this.gameStateService.getCurrentRound().roundNumber;
	}
	public get totalLevels() {
		return this.gameStateService.getConfig.game.levels;
	}
	constructor(private gameStateService: GameStateService) {}
}
