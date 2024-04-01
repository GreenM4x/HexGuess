import express from 'express';
import WebSocketLogs from './websocket/websocket';

const app = express();
const port = 3000;

export const webSocket = new WebSocketLogs(8080);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


process.on('SIGINT', function () {
	console.log('\nGracefully shutting down');
	webSocket.close();
	process.exit(0);
});
