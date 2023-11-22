import { Signal, WritableSignal, computed, signal } from '@angular/core';
import { GameConfigType } from './GameConfigType';
import { GameRound } from './GameRound';

export class Game {
	config: GameConfigType;
	rounds: GameRound[];
	score: WritableSignal<number>;
	lives: WritableSignal<number>;
	currentRound?: WritableSignal<GameRound>;
	gameState: Signal<'playing' | 'game-over' | 'game-won'>;

	constructor(config: GameConfigType) {
		this.config = config;
		this.rounds = [];
		this.score = signal(0);
		this.lives = signal(config.lives.count);
		this.currentRound = signal(new GameRound(config));
		this.gameState = computed(() => this.updateGameState(config));
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
	}

	private updateGameState(config: GameConfigType) {
		if (this.lives() === 0) {
			return 'game-over';
		} else if (
			config.game.mode === 'turns' &&
			this.rounds.length === config.game.turns
		) {
			return 'game-won';
		} else {
			return 'playing';
		}
	}
}
