export type Firend = {
	name: string;
	onlineStatus: OnlineStatus;
};

export type OnlineStatus = 'online' | 'idle' | 'bussy' | 'offline';
