import { Server, Socket } from 'socket.io';
import { handleIncomingMessage } from './messageHandler.js';

interface ConnectedUser {
  userId: string;
  username: string;
  sessionId: string;
}

interface Room {
  id: string;
  name: string;
  creator: ConnectedUser;
  mode: string;
  maxPlayers: number;
  connectedPlayers: ConnectedUser[];
}

export default class SocketIOManager {
  io: Server;
  connectedUsers: Map<string, ConnectedUser> = new Map();
  rooms: Map<string, Room> = new Map();

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ENV === 'dev' ? ['http://localhost:4200'] : false,
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
      },
      path: '/api/ws',
      pingInterval: 10000,
      pingTimeout: 5000,
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    console.log(`🤖 Socket.IO connected: ${socket.id}`);

    socket.on('user_connect', (connectedUser: ConnectedUser) => {
      if (this.connectedUsers.has(socket.id)) {
        const existingUser = this.connectedUsers.get(socket.id);
        if (existingUser.username !== connectedUser.username) {
          console.log(`🔄 User ${existingUser.username} is now ${connectedUser.username}`);
        }
      } else {
        console.log(`➕ User ${connectedUser.username} connected`);
      }
      this.connectedUsers.set(socket.id, {
        ...connectedUser,
        sessionId: socket.id,
      });
      this.updateConnectedUsers();
    });

    socket.on('create_room', (roomData, callback) => {
      const connectedUser = this.connectedUsers.get(socket.id);
      if (!connectedUser) {
        callback({ success: false, message: 'User not connected' });
        return;
      }
      const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const newRoom: Room = {
        id: roomId,
        name: roomData.name || `Room ${this.rooms.size + 1}`,
        creator: connectedUser,
        mode: roomData.mode || 'Classic',
        maxPlayers: roomData.maxPlayers || 4,
        connectedPlayers: [connectedUser],
      };
      this.rooms.set(roomId, newRoom);
      socket.join(roomId);
      console.log(`🏠 Room created: ${newRoom.name} by ${connectedUser.username}`);
      this.updateRooms();
      callback({ success: true, room: newRoom });
    });

    socket.on('join_room', (roomId, callback) => {
      const room = this.rooms.get(roomId);
      const connectedUser = this.connectedUsers.get(socket.id);
      if (!room) {
        callback({ success: false, message: 'Room not found' });
        return;
      }
      if (!connectedUser) {
        callback({ success: false, message: 'User not connected' });
        return;
      }
      if (room.connectedPlayers.length >= room.maxPlayers) {
        callback({ success: false, message: 'Room is full' });
        return;
      }
      room.connectedPlayers.push(connectedUser);
      socket.join(roomId);
      console.log(`👤 User ${connectedUser.username} joined room ${room.name}`);
      this.updateRoomPlayers(roomId);
      callback({ success: true, room });
    });

    socket.on('leave_room', (roomId, callback) => {
      const room = this.rooms.get(roomId);
      const connectedUser = this.connectedUsers.get(socket.id);
      if (!room) {
        callback({ success: false, message: 'Room not found' });
        return;
      }
      if (!connectedUser) {
        callback({ success: false, message: 'User not connected' });
        return;
      }
      room.connectedPlayers = room.connectedPlayers.filter(
        (user) => user.sessionId !== socket.id
      );
      socket.leave(roomId);
      console.log(`👤 User ${connectedUser.username} left room ${room.name}`);
      if (room.connectedPlayers.length === 0) {
        this.rooms.delete(roomId);
        console.log(`🗑️ Room ${room.name} deleted (empty)`);
        this.updateRooms();
      } else {
        this.updateRoomPlayers(roomId);
      }
      callback({ success: true });
    });

    socket.on('message', (data: any) => {
      handleIncomingMessage(this, data, socket.id);
    });

    socket.on('disconnect', () => {
      const disconnectedUser = this.connectedUsers.get(socket.id);
      if (disconnectedUser) {
        console.log(`➖ User ${disconnectedUser.username} disconnected`);
        this.connectedUsers.delete(socket.id);
        // Remove user from any rooms they were in
        this.rooms.forEach((room, roomId) => {
          room.connectedPlayers = room.connectedPlayers.filter(
            (user) => user.sessionId !== socket.id
          );
          if (room.connectedPlayers.length === 0) {
            this.rooms.delete(roomId);
            console.log(`🗑️ Room ${room.name} deleted (empty)`);
            this.updateRooms();
          } else {
            this.updateRoomPlayers(roomId);
          }
        });
      } else {
        console.log(`➖ A user disconnected before completing login.`);
      }
      this.updateConnectedUsers();
    });
  }

  private updateConnectedUsers() {
    this.io.emit(
      'user_update',
      Array.from(this.connectedUsers.values()).map((user) => ({
        username: user.username,
        sessionId: user.sessionId,
      }))
    );
  }

  private updateRooms() {
    this.io.emit(
      'room_update',
      Array.from(this.rooms.values()).map((room) => ({
        id: room.id,
        name: room.name,
        creator: room.creator.username,
        mode: room.mode,
        maxPlayers: room.maxPlayers,
        connectedPlayers: room.connectedPlayers.map((user) => user.username),
      }))
    );
  }

  private updateRoomPlayers(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit('room_player_update', {
        roomId: room.id,
        connectedPlayers: room.connectedPlayers.map((user) => user.username),
      });
      this.updateRooms(); // Update room list for all clients
    }
  }

  sendMessage(event: string, data: any) {
    this.io.emit(event, data);
  }
}
