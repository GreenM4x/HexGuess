import { Injectable, WritableSignal, signal } from '@angular/core';
import { GameConfigurationService } from './game-configuration.service';
import { GameConfigType } from '@shared/models/GameConfigType';
import { Game } from '@shared/models/Game';

@Injectable({
	providedIn: 'root',
})
export class GameStateService {
	private currentGame: WritableSignal<Game> = signal(null);
	private config: GameConfigType;

	public get getTimer() {
		return this.currentGame().time;
	}

	public get getCurrentRound() {
		return this.currentGame().currentRound;
	}

	public get getScore() {
		return this.currentGame().score;
	}

	public get getLivesCount() {
		return this.currentGame().lives;
	}

	public get getGameState() {
		return this.currentGame().gameState;
	}

	public get getCurrentGame() {
		return this.currentGame();
	}

	constructor(private gameConfigurationService: GameConfigurationService) {
		this.config = this.gameConfigurationService.getGameConfig();
	}

	public startNewGame() {
		this.currentGame.set(new Game(this.config));
	}

	public startNewRound() {
		this.currentGame().nextRound();
	}
}
