import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { GameConfigType } from './GameConfigType';
import { GameRound } from './GameRound';

export class Game {
	config: GameConfigType;
	rounds: GameRound[];
	score: WritableSignal<number>;
	lives: WritableSignal<number>;
	time: WritableSignal<number>;
	currentRound?: WritableSignal<GameRound>;
	gameState: Signal<'playing' | 'game-over' | 'game-won'>;
	private timerInterval: ReturnType<typeof setTimeout> | undefined;

	constructor(config: GameConfigType) {
		this.config = config;
		this.rounds = [];
		this.score = signal(0);
		this.lives = signal(config.lives.count);
		this.time = signal(config.time.count);
		this.currentRound = signal(new GameRound(config));
		this.gameState = computed(() => this.updateGameState(config));
		this.startCountdownTimer();
	}

	public increaseScore(score: number) {
		this.score.update(prev => prev + score);
	}

	public descreaseLivesBy(num: number) {
		if (this.lives() > 0) {
			this.lives.update(prev => prev - num);
		}
	}

	public updateRounds(round: GameRound) {
		this.rounds = [...this.rounds, round];
	}

	public nextRound() {
		this.updateRounds(this.currentRound());
		this.currentRound.set(new GameRound(this.config));
		this.config.time.enabled && this.restartTimer();
	}

	private updateGameState(config: GameConfigType) {
		if (this.lives() === 0) {
			this.resetCountdownTimer();
			return 'game-over';
		} else if (
			config.game.mode === 'turns' &&
			this.rounds.length === config.game.turns
		) {
			this.resetCountdownTimer();
			return 'game-won';
		} else {
			return 'playing';
		}
	}

	private startCountdownTimer() {
		this.time.set(this.config.time.count);
		this.timerInterval = setInterval(() => {
			this.time.update(prev => prev - 1);
			if (this.time() <= 0) {
				this.descreaseLivesBy(1);
				if (this.lives() > 0) {
					this.restartTimer();
				}
				return;
			}
		}, 1000);
	}

	private resetCountdownTimer() {
		clearInterval(this.timerInterval);
	}

	public restartTimer() {
		this.resetCountdownTimer();
		this.startCountdownTimer();
	}
}
