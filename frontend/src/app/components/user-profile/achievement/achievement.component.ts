import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Achievements } from '@shared/models/UserType.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	faAward,
	faGaugeHigh,
	faTemperatureLow,
	faTrophy,
} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-achievement',
	standalone: true,
	imports: [CommonModule, FontAwesomeModule],
	templateUrl: './achievement.component.html',
	styleUrl: './achievement.component.scss',
})
export class AchievementComponent {
	faTrophy = faTrophy;
	@Input() achievement: Achievements;
}
