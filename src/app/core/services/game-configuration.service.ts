import { Injectable } from '@angular/core';
import { GameConfigType } from '@shared/models/GameConfigType';
import { GameModeEnum, gameModeConfig } from '../config/game.config';

@Injectable({
	providedIn: 'root',
})
export class GameConfigurationService {
	private currentGameSettings;

	constructor() {
		this.currentGameSettings = gameModeConfig.multiNormal;
	}

	public updateGameConfig(config: GameConfigType) {
		this.currentGameSettings = config;
	}

	public getGameConfig() {
		return this.currentGameSettings;
	}

	public getGameConfigByMode(mode: GameModeEnum) {
		return gameModeConfig[mode];
	}
}
