import { GameConfigType } from './GameConfigType';

export class GameRound {
	options: string[];
	colorToGuess: string;
	guesses: string[];
	timeTaken?: number;

	constructor(gameConfig: GameConfigType) {
		this.options = Array(gameConfig.guess.responseOptionsCount)
			.fill('')
			.map(() => this.generateRandomHex());
		const indexToGuess = Math.floor(Math.random() * this.options.length);
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
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	}
}
