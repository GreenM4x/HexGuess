import { Component } from '@angular/core';
import { GameStateService } from '@core/services/game-state.service';

@Component({
	selector: 'app-score',
	templateUrl: './score.component.html',
	styleUrls: ['./score.component.scss'],
	standalone: true,
})
export class ScoreComponent {
	public get score() {
		return this.gameStateService.getScore();
	}
	constructor(private gameStateService: GameStateService) {}
}
