import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameLogicService } from '../../services/game-logic.service';

@Component({
	selector: 'app-timer',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './timer.component.html',
	styleUrl: './timer.component.scss',
})
export class TimerComponent {
	public get timer(): number {
		return this.glService.getTimer;
	}
	constructor(private glService: GameLogicService) {}
}
