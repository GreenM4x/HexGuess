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

	onInput(event: Event) {
		const input = event.target as HTMLInputElement;

		console.log(input.value);
		// Remove first char if it's # or not
		const userPart = input.value.startsWith('#')
			? input.value.slice(1)
			: input.value;

		// Keep only digits
		const colorCodePart = userPart.replace(/[^0-9a-fA-F]/g, '');

		// Always reset the input's value directly
		input.value = '#' + colorCodePart;

		// Update Angular value so Angular stays in sync
		this.value = '#' + colorCodePart;
	}

	get safeColor(): string {
		const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
		if (hexRegex.test(this.value)) {
			return this.value;
		}
		return '#000000'; // fallback color
	}
}
