import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GameLogicService {
	constructor() {}

	private gameObj: { colorToGuess: string; optionsArr: string[] } = {
		colorToGuess: '000000',
		optionsArr: ['000000', '111111', '222222', '333333'],
	};

	private currentTimer: number = 60;
	private timerInterval: NodeJS.Timeout | undefined;

	private lives: number = 3;

	public livesArr: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([
		false,
		false,
		false,
	]);

	public score: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	setBoard(): { colorToGuess: string; optionsArr: string[] } {
		let indeces = [1, 2, 3, 4];
		indeces = this.shuffleArray(indeces);

		this.gameObj.optionsArr.forEach((_, i) => {
			this.gameObj.optionsArr[i] = this.generateRandomHex();
		});

		switch (indeces[0]) {
			case 1:
				this.gameObj.colorToGuess = this.gameObj.optionsArr[0];
				break;
			case 2:
				this.gameObj.colorToGuess = this.gameObj.optionsArr[1];
				break;
			case 3:
				this.gameObj.colorToGuess = this.gameObj.optionsArr[2];
				break;
			case 4:
				this.gameObj.colorToGuess = this.gameObj.optionsArr[3];
				break;
			default:
				this.gameObj.colorToGuess = this.generateRandomHex();
				break;
		}

		this.resetCountdownTimer();
		this.startCountdownTimer();

		return this.gameObj;
	}

	shuffleArray<T>(array: T[]): T[] {
		const shuffledArray = [...array];

		for (let i = shuffledArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));

			[shuffledArray[i], shuffledArray[j]] = [
				shuffledArray[j],
				shuffledArray[i],
			];
		}

		return shuffledArray;
	}

	generateRandomHex(): string {
		const letters = '0123456789ABCDEF';
		let color = '';

		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}

		return color;
	}

	setColorToGuess(color: string) {
		this.gameObj.colorToGuess = color;
	}

	checkForWin(option: string): boolean {
		if (option === this.gameObj.colorToGuess) {
			return true;
		} else {
			return false;
		}
	}

	updateScore() {
		this.score.next(this.score.value + this.currentTimer);
	}

	updateLifes() {
		const currentValue = this.livesArr.getValue();
		currentValue[this.lives - 1] = true;
		this.lives--;
		this.livesArr.next(currentValue);
	}

	startCountdownTimer() {
		this.currentTimer = 60;
		this.timerInterval = setInterval(() => {
			this.currentTimer--;

			if (this.currentTimer === 0) {
				this.resetCountdownTimer();
				this.updateLifes();
				this.setBoard();
			}
		}, 1000);
	}

	private resetCountdownTimer() {
		clearInterval(this.timerInterval);
	}
}
