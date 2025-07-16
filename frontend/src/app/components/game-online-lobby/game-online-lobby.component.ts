import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-game-online-lobby',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './game-online-lobby.component.html',
	styleUrl: './game-online-lobby.component.scss',
})
export class GameOnlineLobbyComponent {
	value = '#';
	isValidColor = false;

	onInput(event: Event) {
		const input = event.target as HTMLInputElement;

		const userPart = input.value.startsWith('#')
			? input.value.slice(1)
			: input.value;
		const colorCodePart = userPart.replace(/[^0-9a-fA-F]/g, '').toUpperCase();

		input.value = '#' + colorCodePart;
		this.value = '#' + colorCodePart;

		this.isValidColor = /^#[0-9A-F]{6}$/.test(this.value);
	}

	get safeColor(): string {
		const hexRegex = /^#([0-9a-fA-F]{6})$/;
		return hexRegex.test(this.value) ? this.value : '#5a78ab';
	}
}
