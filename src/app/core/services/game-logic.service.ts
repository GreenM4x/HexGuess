import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardType } from '@shared/models/BoardType';

@Injectable({
	providedIn: 'root',
})
export class GameLogicService {
	public readonly INITIAL_TIMER_VALUE = 60;
	public readonly INITIAL_LIVES_VALUE = 3;
	public readonly INITIAL_OPTIONS_AMOUNT = 4;
	public livesCount: BehaviorSubject<number> = new BehaviorSubject<number>(
		this.INITIAL_LIVES_VALUE
	);
	public score: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	private gameObj: BoardType = {
		colorToGuess: '000000',
		optionsArr: Array(this.INITIAL_OPTIONS_AMOUNT).fill('000000'),
	};
	private currentTimer = signal(this.INITIAL_TIMER_VALUE);
	private timerInterval: ReturnType<typeof setTimeout> | undefined;

	public get getTimer(): number {
		return this.currentTimer();
	}

	constructor() {}

	setBoard(): BoardType {
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

	reduceLifes() {
		if (this.livesCount.value > 0) {
			this.livesCount.next(this.livesCount.value - 1);
		}
	}

	startCountdownTimer() {
		this.currentTimer.set(this.INITIAL_TIMER_VALUE);
		this.timerInterval = setInterval(() => {
			this.currentTimer.update(prev => prev - 1);

			if (this.currentTimer() === 0) {
				this.resetCountdownTimer();
				this.reduceLifes();
				this.setBoard();
			}
		}, 1000);
	}

	resetGame() {
		this.resetCountdownTimer();
		this.resetScore();
		this.resetLifes();
		this.setBoard();
	}

	public resetCountdownTimer() {
		clearInterval(this.timerInterval);
	}

	private resetScore() {
		this.score.next(0);
	}

	private resetLifes() {
		this.livesCount.next(this.INITIAL_LIVES_VALUE);
	}
}
