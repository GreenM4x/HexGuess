export type User = {
	userName: string;
	imgUrl: string;
	onlineStatus: OnlineStatus;
	achievements?: Achievements[];
	stats?: Stats[];
};

export type OnlineStatus = 'online' | 'idle' | 'bussy' | 'offline';
export type Achievements = { name: string; obtained: boolean };
export type Stats = { name: string; value: number };
