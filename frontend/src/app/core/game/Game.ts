import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { GameConfigType } from '../../shared/models/GameConfigType';
import { GameRound } from './GameRound';
import seedrandom from 'seedrandom';

export class Game {
	config: GameConfigType;
	rounds: WritableSignal<GameRound[]>;
	score: WritableSignal<number>;
	lives: WritableSignal<number>;
	time: WritableSignal<number>;
	currentRound: WritableSignal<GameRound>;
	gameState: Signal<'playing' | 'game-over' | 'game-won'>;
	totalLevels: number;
	private timerInterval: ReturnType<typeof setTimeout> | undefined;
	private id: string = crypto.randomUUID();
	private rngRoundSeed: seedrandom.PRNG = seedrandom(this.id);

	constructor(config: GameConfigType) {
		this.config = config;
		this.rounds = signal([]);
		this.score = signal(0);
		this.lives = signal(config.lives.count);
		this.time = signal(config.time.count);
		this.totalLevels = config.game.levels;
		this.currentRound = signal(new GameRound(config, this.id, 1));
		this.gameState = computed(() => this.updateGameState(config));
		this.startCountdownTimer();
	}

	public increaseScore(score: number) {
		this.score.update(prev => prev + score);
	}

	public decreaseLivesBy(num: number) {
		if (this.lives() > 0) {
			this.lives.update(prev => prev - num);
		}
	}

	public updateRounds(round: GameRound) {
		this.rounds.update(rounds => [...rounds, round]);
	}

	public nextRound() {
		this.updateRounds(this.currentRound());
		if (
			this.config.game.mode === 'level' &&
			this.rounds().length === this.config.game.levels
		) {
			this.handleLevelEnd();
			return;
		}
		this.currentRound.set(
			new GameRound(
				this.config,
				this.rngRoundSeed.int32().toString(),
				this.rounds().length + 1
			)
		);
		this.config.time.enabled && this.restartTimer();
	}

	private handleLevelEnd() {
		this.config.time.enabled && this.resetCountdownTimer();
	}

	private updateGameState(config: GameConfigType) {
		if (this.lives() === 0 && config.lives.enabled) {
			this.resetCountdownTimer();
			return 'game-over';
		}

		if (
			config.game.mode === 'level' &&
			this.rounds().length === config.game.levels
		) {
			this.resetCountdownTimer();
			return 'game-won';
		}
		return 'playing';
	}

	private startCountdownTimer() {
		this.time.set(this.config.time.count);
		this.timerInterval = setInterval(() => {
			this.time.update(prev => prev - 1);
			if (this.time() <= 0) {
				this.handleTimerExpiration();
			}
		}, 1000);
	}

	private resetCountdownTimer() {
		clearInterval(this.timerInterval);
	}

	private restartTimer() {
		this.resetCountdownTimer();
		this.startCountdownTimer();
	}

	private handleTimerExpiration() {
		if (this.config.lives.enabled) {
			this.decreaseLivesBy(1);
			if (this.lives() > 0) {
				this.restartTimer();
			}
		} else if (this.config.game.mode === 'level') {
			this.nextRound();
		}
	}
}
