import { GameConfigType } from '../../shared/models/GameConfigType';
import seedrandom from 'seedrandom';

export class GameRound {
	roundNumber: number;
	options: string[];
	colorToGuess: string;
	guesses: string[];
	timeTaken?: number;
	rng: seedrandom.PRNG;

	constructor(
		gameConfig: GameConfigType,
		roundId: string,
		roundNumber: number
	) {
		this.rng = seedrandom(roundId);
		this.roundNumber = roundNumber;
		this.options = Array(gameConfig.guess.responseOptionsCount)
			.fill('')
			.map(() => this.generateRandomHex());
		const indexToGuess = Math.floor(this.rng() * this.options.length);
		this.colorToGuess = this.options[indexToGuess];
		this.guesses = [];
	}

	public updateGuesses(guess: string) {
		this.guesses = [...this.guesses, guess];
	}

	private generateRandomHex(): string {
		const letters = '0123456789ABCDEF';
		let color = '';

		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(this.rng() * 16)];
		}

		return color;
	}
}
