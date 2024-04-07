import { WSMessageType } from "../models/WebSocketModels.js";
import SocketIOLogs from "./socket-io.js";



export function handleIncomingMessage(server: SocketIOLogs, message: any) {
	switch (message.type) {
		case WSMessageType.LOG:
			console.log(message.data);
			break;
		default:
			console.log('Unknown message type:', message.type);
	}
}
