import { Component, OnInit } from '@angular/core';
import { GameLogicService } from 'src/app/services/game-logic.service';

@Component({
	selector: 'app-score',
	templateUrl: './score.component.html',
	styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
	score!: number;

	constructor(private glService: GameLogicService) {}
	ngOnInit(): void {
		this.glService.score.subscribe(e => {
			this.score = e;
		});
	}
}
