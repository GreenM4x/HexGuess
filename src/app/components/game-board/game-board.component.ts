import { Component, Signal, computed } from '@angular/core';
import { GameLogicService } from '@services/game-logic.service';
import { GameStateService } from '@core/services/game-state.service';

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
	public lives: Signal<boolean[]> = computed(() => this.updateLivesArray());

	public get gameState() {
		return this.gameStateSerivce.getGameState();
	}

	public get currentRound() {
		return this.gameStateSerivce.getCurrentRound();
	}

	public get config() {
		return this.gameStateSerivce.getConfig;
	}

	constructor(
		public gameStateSerivce: GameStateService,
		private gameLogicService: GameLogicService
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
	}

	private updateLivesArray() {
		const startingLives = this.config.lives.count;
		const lives = this.gameStateSerivce.getLivesCount();
		return Array(startingLives)
			.fill(false)
			.map((life, index) => index >= lives);
	}
}
