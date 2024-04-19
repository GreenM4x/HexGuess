import { Component, Input } from '@angular/core';
import { Stats } from '@shared/models/UserType.js';

@Component({
	selector: 'app-stats',
	standalone: true,
	imports: [],
	templateUrl: './stats.component.html',
	styleUrl: './stats.component.scss',
})
export class StatsComponent {
	@Input() stat: Stats;

	public formatValue(value: number): string {
		if (value < 1000) {
			return value.toFixed(0);
		} else if (value < 1000000) {
			return (value / 1000).toFixed(1) + 'k';
		} else {
			return (value / 1000000).toFixed(1) + 'M';
		}
	}
}
