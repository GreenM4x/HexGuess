import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class GameLogicService {
	public livesArr: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([
		false,
		false,
		false,
	]);
	public score: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public readonly INITIAL_TIMER_VALUE = 60;

	private gameObj: { colorToGuess: string; optionsArr: string[] } = {
		colorToGuess: '000000',
		optionsArr: Array(4).fill('000000'),
	};
	private currentTimer = signal(this.INITIAL_TIMER_VALUE);
	private timerInterval: ReturnType<typeof setTimeout> | undefined;
	private lives: number = 3;

	public get getTimer(): number {
		return this.currentTimer();
	}

	constructor() {}

	setBoard(): { colorToGuess: string; optionsArr: string[] } {
		this.gameObj.optionsArr = this.gameObj.optionsArr.map(() =>
			this.generateRandomHex()
		);
		const indexToGuess = Math.floor(
			Math.random() * this.gameObj.optionsArr.length
		);
		this.gameObj.colorToGuess = this.gameObj.optionsArr[indexToGuess];

		this.resetCountdownTimer();
		this.startCountdownTimer();

		return this.gameObj;
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

	isCorrectGuess(option: string): boolean {
		return option === this.gameObj.colorToGuess;
	}

	updateScore() {
		this.score.next(this.score.value + this.currentTimer());
	}

	updateLifes() {
		const currentValue = this.livesArr.getValue();
		currentValue[this.lives - 1] = true;
		this.lives--;
		this.livesArr.next(currentValue);
	}

	startCountdownTimer() {
		this.currentTimer.set(this.INITIAL_TIMER_VALUE);
		this.timerInterval = setInterval(() => {
			this.currentTimer.update(prev => prev - 1);

			if (this.currentTimer() === 0) {
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
