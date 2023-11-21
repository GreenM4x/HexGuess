import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameLogicService } from 'src/app/services/game-logic.service';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() option!: string;
	@Output() btnClicked: EventEmitter<string> = new EventEmitter<string>();
	public showFloatNumber = false;
	public floatPosX = 0;
	public floatPosY = 0;
	public floatText = '';
	public isCorrect: boolean | undefined;

	constructor(public glService: GameLogicService) {}

	btnPressed(event: MouseEvent) {
		this.btnClicked.emit(this.option);
		this.isCorrect = this.glService.isCorrectGuess(this.option);
		if (this.isCorrect) this.displayPoints(event);
	}

	private displayPoints(event: MouseEvent) {
		this.showFloatNumber = true;
		this.floatText = `+${this.glService.getTimer}`;
		this.floatPosX = event.offsetX;
		this.floatPosY = event.offsetY + -30;
		setTimeout(() => {
			this.showFloatNumber = false;
		}, 1000);
	}
}
