export type GameConfigType = {
	lives: {
		enabled: boolean;
		count: number;
	};
	time: {
		enabled: boolean;
		count: number;
	};
	score: {
		enabled: boolean;
		count: number;
		pointsTimeRatio: number;
	};
	guess: {
		mode: 'color' | 'hex';
		responseOptionsCount: number;
	};
	game: {
		mode: 'infinite' | 'level' | 'time';
		levels: number;
	};
};
