import {
	WSMessageType,
} from '../models/WebSocketModels';
import WebSocketLogs from './websocket';


export function handleIncomingMessage(server: WebSocketLogs, message: any, userID: number) {
	switch (message.type) {
		case WSMessageType.LOG:
			console.log(message.data);
			console.log('userID :>> ', userID);
			break;
		default:
			console.log('Unknown message type:', message.type);
	}
}
