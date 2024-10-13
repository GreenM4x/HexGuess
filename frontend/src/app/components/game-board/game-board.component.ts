import { Component, OnDestroy, Signal, computed } from '@angular/core';
import { GameLogicService } from '@services/game-logic.service';
import { GameStateService } from '@core/services/game-state.service';
import { ButtonComponent } from './game-components/button/button.component';
import { HeartComponent } from './game-components/heart/heart.component';
import { CommonModule } from '@angular/common';
import { ScoreComponent } from './game-components/score/score.component';
import { LevelComponent } from './game-components/level/level.component';
import { TimerComponent } from './game-components/timer/timer.component';
import { ActivatedRoute } from '@angular/router';
import { GameConfigurationService } from '../../core/services/game-configuration.service';
import { GameModeEnum } from '../../core/config/game.config';

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		TimerComponent,
		LevelComponent,
		ScoreComponent,
		HeartComponent,
		ButtonComponent,
	],
})
export class GameBoardComponent implements OnDestroy {
	public lives: Signal<boolean[]> = computed(() => this.updateLivesArray());

	public get gameState() {
		return this.gameStateService.getGameState();
	}

	public get currentRound() {
		return this.gameStateService.getCurrentRound();
	}

	public get config() {
		return this.gameStateService.getConfig;
	}

	constructor(
		public gameStateService: GameStateService,
		private gameLogicService: GameLogicService,
		private gameConfigurationService: GameConfigurationService,
		private activatedRoute: ActivatedRoute
	) {
		this.activatedRoute.params.subscribe(params => {
			const gameMode: GameModeEnum = params['gameMode'];
			this.gameConfigurationService.updateGameConfig(gameMode);
			this.gameStateService.startNewGame();
		});
	}

	public processGuess(color: string) {
		this.gameLogicService.processGuess({
			hexGuess: color,
			score: this.gameStateService.getTimer(),
		});
	}

	public restartGame() {
		this.gameStateService.startNewGame();
	}

	public ngOnDestroy(): void {
		this.gameStateService.endGame();
	}

	private updateLivesArray() {
		const startingLives = this.config.lives.count;
		const lives = this.gameStateService.getLivesCount();
		return Array(startingLives)
			.fill(false)
			.map((life, index) => index >= lives);
	}
}
