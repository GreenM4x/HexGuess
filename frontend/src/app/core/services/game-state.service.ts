import { Injectable, WritableSignal, signal } from '@angular/core';
import { GameConfigurationService } from './game-configuration.service';
import { GameConfigType } from '@shared/models/GameConfigType';
import { Game } from '@core/game/Game';

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

	public get getConfig() {
		return this.currentGame().config;
	}

	constructor(private gameConfigurationService: GameConfigurationService) {}

	public startNewGame() {
		this.config = this.gameConfigurationService.getGameConfig();
		this.currentGame.set(new Game(this.config));
	}

	public startNewRound() {
		this.currentGame().nextRound();
	}

	public endGame() {
		this.currentGame.set(null);
	}
}
