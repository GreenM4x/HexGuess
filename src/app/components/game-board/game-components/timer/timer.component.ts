import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, Renderer2 } from '@angular/core';
import { GameConfigurationService } from '@core/services/game-configuration.service';
import { GameStateService } from '@core/services/game-state.service';

@Component({
	selector: 'app-timer',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './timer.component.html',
	styleUrl: './timer.component.scss',
})
export class TimerComponent {
	public get timer() {
		return this.gameStateService.getTimer();
	}

	constructor(
		private gameConfigurationService: GameConfigurationService,
		private gameStateService: GameStateService,
		private el: ElementRef,
		private renderer: Renderer2
	) {
		effect(() => {
			this.updateTimerCircle();
		});
	}

	private updateTimerCircle() {
		const percentage =
			(this.timer / this.gameConfigurationService.getGameConfig().time.count) *
			100;
		const borderColor = percentage <= 25 ? 'red' : 'white';
		const circle = this.el.nativeElement.querySelector('.countdown-circle');
		const gradient = `linear-gradient(var(--background-color), var(--background-color)) content-box no-repeat,
					conic-gradient(${borderColor} ${percentage}%, 0, var(--background-color) ) border-box`;

		this.renderer.setStyle(circle, 'background', gradient);
	}
}
