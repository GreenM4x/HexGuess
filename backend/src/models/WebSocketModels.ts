export enum LogLevel {
	Info = 'info',
	Error = 'error',
	Warning = 'warning',
	Success = 'success',
	Default = 'default',
}

export enum WSMessageType {
	INIT = 'init',
	LOG = 'log',
	USER_UPDATE = 'user_update',
}

export type WebsocketEvent = { type: WSMessageType; data: null }



