import { GameConfigType } from '@shared/models/GameConfigType';
import { GameModeType } from '@shared/models/GameModeType';

export const normalGameConfig: GameConfigType = {
	lives: {
		enabled: true,
		count: 3,
	},
	time: {
		enabled: true,
		count: 30,
	},
	score: {
		enabled: true,
		count: 0,
		pointsTimeRatio: 1,
	},
	guess: {
		mode: 'color', // color | hex
		responseOptionsCount: 4,
	},
	game: {
		mode: 'infinite', // turns | infinite | time(evtl)
		turns: 10,
	},
};

export const multiNormalGameConfig: GameConfigType = {
	lives: {
		enabled: false,
		count: 3,
	},
	time: {
		enabled: true,
		count: 30,
	},
	score: {
		enabled: true,
		count: 0,
		pointsTimeRatio: 1,
	},
	guess: {
		mode: 'color', // color | hex
		responseOptionsCount: 4,
	},
	game: {
		mode: 'turns', // turns | infinite | time(evtl)
		turns: 10,
	},
};

export const gameModeConfig: GameModeType = {
	normal: normalGameConfig,
	multiNormal: multiNormalGameConfig,
};

export enum GameModeEnum {
	normal = 'normal',
	multiNormal = 'multiNormal',
}
