import { Injectable, WritableSignal, signal } from '@angular/core';
import { GameConfigurationService } from './game-configuration.service';
import { GameConfigType } from '@shared/models/GameConfigType';
import { Game } from '@shared/models/Game';

@Injectable({
	providedIn: 'root',
})
export class GameStateService {
	private currentGame: WritableSignal<Game> = signal(null);
	private config: GameConfigType;
	private timer: WritableSignal<number>;
	private timerInterval: ReturnType<typeof setTimeout> | undefined;

	public get getTimer() {
		return this.timer;
	}

	public get getCurrentRound() {
		return this.currentGame().currentRound;
	}

	public get getScore() {
		return this.currentGame().score;
	}

	public get getLivesCount() {
		return this.currentGame().lives;
	}

	public get getGameState() {
		return this.currentGame().gameState;
	}

	public get getCurrentGame() {
		return this.currentGame;
	}

	constructor(private gameConfigurationService: GameConfigurationService) {
		this.config = this.gameConfigurationService.getGameConfig();
		this.timer = signal(this.config.time.count);
	}

	public startNewGame() {
		this.currentGame.set(new Game(this.config));
		if (this.config.time.enabled) {
			this.resetCountdownTimer();
			this.startCountdownTimer();
		}
	}

	public startNewRound() {
		this.currentGame().nextRound();
		if (this.config.time.enabled) {
			this.resetCountdownTimer();
			this.startCountdownTimer();
		}
	}

	private startCountdownTimer() {
		this.timer.set(this.config.time.count);
		this.timerInterval = setInterval(() => {
			this.timer.update(prev => prev - 1);

			if (this.timer() === 0) {
				this.startNewRound();
				this.resetCountdownTimer();
				this.currentGame().descreaseLivesBy(1);
			}
		}, 1000);
	}

	private resetCountdownTimer() {
		clearInterval(this.timerInterval);
	}
}
