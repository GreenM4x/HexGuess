import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import SocketIOLogs from './websocket/socket-io.js';
import 'dotenv/config';

const app = express();
const port = 3000;

const server = createServer(app);
export const io = new SocketIOLogs(server);

app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend! ' + process.env.ENV });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


process.on('SIGINT', function () {
	console.log('\nGracefully shutting down');
	io.io.close();
	process.exit(0);
});
