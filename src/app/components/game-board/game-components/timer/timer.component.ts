import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, Renderer2 } from '@angular/core';
import { GameLogicService } from '@services/game-logic.service';

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

	constructor(
		private glService: GameLogicService,
		private el: ElementRef,
		private renderer: Renderer2
	) {
		effect(() => {
			this.updateTimerCircle();
		});
	}

	private updateTimerCircle() {
		const percentage = (this.timer / this.glService.INITIAL_TIMER_VALUE) * 100;
		const borderColor = percentage <= 25 ? 'red' : 'white';
		const circle = this.el.nativeElement.querySelector('.countdown-circle');
		const gradient = `linear-gradient(var(--background-color), var(--background-color)) content-box no-repeat,
					conic-gradient(${borderColor} ${percentage}%, 0, var(--background-color) ) border-box`;

		this.renderer.setStyle(circle, 'background', gradient);
	}
}
