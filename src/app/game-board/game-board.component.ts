import { Component, OnInit } from '@angular/core';
import { GameLogicService } from '../services/game-logic.service';

@Component({
	selector: 'app-game-board',
	templateUrl: './game-board.component.html',
	styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
	isGameOver: boolean;
	lives: boolean[];
	score: number;
	roundEnd: boolean;
	gameBoard: { colorToGuess: string; optionsArr: string[] };

	constructor(public glService: GameLogicService) {}

	ngOnInit(): void {
		this.gameBoard = this.glService.setBoard();
		this.glService.livesCount.subscribe(lives => {
			const startingLives = this.glService.INITIAL_LIVES_VALUE;
			this.lives = Array(startingLives)
				.fill(false)
				.map((life, index) => index >= lives);
		});
	}

	checkForWin(color: string) {
		this.roundEnd = true;
		if (this.glService.isCorrectGuess(color)) {
			this.glService.updateScore();
			setTimeout(() => {
				this.gameBoard = this.glService.setBoard();
				this.roundEnd = false;
			}, 1000);
		} else {
			this.glService.reduceLifes();
			this.roundEnd = false;
			if (!this.lives.includes(false)) {
				this.glService.resetCountdownTimer();
				this.isGameOver = true;
			}
		}
	}

	restartGame() {
		this.isGameOver = false;
		this.glService.resetGame();
		this.gameBoard = this.glService.setBoard();
	}
}
