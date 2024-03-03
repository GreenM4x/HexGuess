import { Injectable } from '@angular/core';
import { GameModeEnum, gameModeConfig } from '../config/game.config';

@Injectable({
	providedIn: 'root',
})
export class GameConfigurationService {
	private currentGameSettings;

	constructor() {
		this.currentGameSettings = gameModeConfig.onlineHex;
	}

	public updateGameConfig(gameMode: GameModeEnum) {
		this.currentGameSettings = this.getGameConfigByMode(gameMode);
	}

	public getGameConfig() {
		return this.currentGameSettings;
	}

	private getGameConfigByMode(mode: GameModeEnum) {
		return gameModeConfig[mode];
	}
}
