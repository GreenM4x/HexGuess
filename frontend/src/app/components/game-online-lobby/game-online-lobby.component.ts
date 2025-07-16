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

		// Remove # if present and keep only hex chars
		const userPart = input.value.startsWith('#')
			? input.value.slice(1)
			: input.value;
		const colorCodePart = userPart.replace(/[^0-9a-fA-F]/g, '').toUpperCase();

		// Always update input value
		input.value = '#' + colorCodePart;
		this.value = '#' + colorCodePart;

		// ✅ Update validity only now, once
		this.isValidColor = /^#[0-9A-F]{6}$/.test(this.value);
	}

	get safeColor(): string {
		const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
		return hexRegex.test(this.value) ? this.value : '#000000';
	}
}
