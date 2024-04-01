import {
	WSMessageType,
} from '../models/WebSocketModels';
import { SocketIOLogs } from './socket-io';


export function handleIncomingMessage(server: SocketIOLogs, message: any, socketId: string) {
	switch (message.type) {
		case WSMessageType.LOG:
			console.log(message.data);
			break;
		default:
			console.log('Unknown message type:', message.type);
	}
}
