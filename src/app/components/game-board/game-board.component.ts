import { Component, Signal, computed } from '@angular/core';
import { GameLogicService } from '@services/game-logic.service';
import { GameStateService } from '@core/services/game-state.service';
import { GameConfigurationService } from '@core/services/game-configuration.service';

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
	public gameState: 'playing' | 'game-over' | 'game-won';
	public lives: Signal<boolean[]> = computed(() => this.updateLivesArray());

	public get isGameOver() {
		return this.gameStateSerivce.getGameState() === 'game-over';
	}

	public get options() {
		return this.gameStateSerivce.getCurrentRound().options;
	}

	public get colorToGuess() {
		return this.gameStateSerivce.getCurrentRound().colorToGuess;
	}

	public get score() {
		return this.gameStateSerivce.getScore();
	}

	constructor(
		private gameLogicService: GameLogicService,
		public gameStateSerivce: GameStateService,
		private gameConfigService: GameConfigurationService
	) {
		this.gameStateSerivce.startNewGame();
	}

	public processGuess(color: string) {
		this.gameLogicService.processGuess({
			hexGuess: color,
			score: this.gameStateSerivce.getTimer(),
		});
	}

	public restartGame() {
		this.gameStateSerivce.startNewGame();
		this.updateLivesArray();
	}

	private updateLivesArray() {
		const startingLives = this.gameConfigService.getGameConfig().lives.count;
		const lives = this.gameStateSerivce.getCurrentGame().lives();
		return Array(startingLives)
			.fill(false)
			.map((life, index) => index >= lives);
	}
}
