import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameLogicService } from '@services/game-logic.service';
import { GameStateService } from '@core/services/game-state.service';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() option: string;
	@Output() btnClicked: EventEmitter<string> = new EventEmitter<string>();
	public showFloatNumber = false;
	public floatPosX = 0;
	public floatPosY = 0;
	public floatText = '';
	public isCorrect: boolean | undefined;

	constructor(
		private gameStateService: GameStateService,
		private gameLogicService: GameLogicService
	) {}

	btnPressed(event: MouseEvent) {
		this.btnClicked.emit(this.option);
		this.isCorrect = this.gameLogicService.isCorrectGuess(this.option);
		if (this.isCorrect) this.displayPoints(event);
	}

	private displayPoints(event: MouseEvent) {
		this.showFloatNumber = true;
		this.floatText = `+${this.gameStateService.getTimer()}`;
		this.floatPosX = event.offsetX;
		this.floatPosY = event.offsetY + -30;
		setTimeout(() => {
			this.showFloatNumber = false;
		}, 1000);
	}
}
