import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
	providedIn: 'root',
})
export class GameLogicService {
	constructor(private gameState: GameStateService) {}

	isCorrectGuess(option: string): boolean {
		return option === this.gameState.getCurrentRound().colorToGuess;
	}

	processGuess(guess: { score: number; hexGuess: string }) {
		if (this.isCorrectGuess(guess.hexGuess)) {
			this.gameState.getCurrentRound().updateGuesses(guess.hexGuess);
			this.gameState.getCurrentGame().increaseScore(guess.score);
			this.gameState.startNewRound();
		} else {
			this.gameState.getCurrentRound().updateGuesses(guess.hexGuess);
			this.gameState.getCurrentGame().descreaseLivesBy(1);
		}
	}
}
