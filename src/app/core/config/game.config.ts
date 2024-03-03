import { GameConfigType } from '@shared/models/GameConfigType';
import { GameModeType } from '@shared/models/GameModeType';

export const baseGameConfig: GameConfigType = {
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
		mode: 'infinite', // level | infinite | time(evtl)
		levels: 10,
	},
};

export const hexGameConfig: GameConfigType = {
	...baseGameConfig,
	lives: {
		...baseGameConfig.lives,
		enabled: false,
	},
	game: {
		...baseGameConfig.game,
		mode: 'level',
	},
};

export const hexInfiniteGameConfig: GameConfigType = {
	...baseGameConfig,
	game: {
		...baseGameConfig.game,
		mode: 'infinite',
	},
};

export const colorGameConfig: GameConfigType = {
	...baseGameConfig,
	lives: {
		...baseGameConfig.lives,
		enabled: false,
	},
	guess: {
		...baseGameConfig.guess,
		mode: 'color',
	},
};

export const colorInfiniteGameConfig: GameConfigType = {
	...baseGameConfig,
	guess: {
		...baseGameConfig.guess,
		mode: 'color',
	},
	game: {
		...baseGameConfig.game,
		mode: 'infinite',
	},
};

export const onlineHexGameConfig: GameConfigType = {
	...baseGameConfig,
	// TODO: tbd
};

export const gameModeConfig: GameModeType = {
	onlineHex: onlineHexGameConfig,
	hex: hexGameConfig,
	hexInfinite: hexInfiniteGameConfig,
	color: colorGameConfig,
	colorInfinite: colorInfiniteGameConfig,
};

export enum GameModeEnum {
	hex = 'hex',
	hexInfinite = 'hexInfinite',
	color = 'color',
	colorInfinite = 'colorInfinite',
	onlineHex = 'onlineHex',
}
