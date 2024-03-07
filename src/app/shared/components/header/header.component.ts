import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@core/services/firebase.service';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { GameStateService } from '../../../core/services/game-state.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	standalone: true,
	imports: [CommonModule, FontAwesomeModule],
})
export class HeaderComponent implements OnInit {
	isLoggedIn: Observable<boolean> = new Observable<boolean>();
	faChevronLeft = faChevronLeft;
	faRightFromBracket = faRightFromBracket;

	public get gameIsActive() {
		return this.gameStateService?.getCurrentGame;
	}

	constructor(
		private fbService: FirebaseService,
		private gameStateService: GameStateService
	) {}

	ngOnInit(): void {
		this.isLoggedIn = this.fbService.isLoggedIn();
	}

	logout() {
		this.fbService.logout();
	}

	back() {
		window.history.back();
	}
}
