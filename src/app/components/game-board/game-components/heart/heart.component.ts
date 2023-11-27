import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-heart',
	templateUrl: './heart.component.html',
	styleUrls: ['./heart.component.scss'],
	standalone: true,
	imports: [CommonModule],
})
export class HeartComponent {
	@Input() isDead: boolean = false;
}
