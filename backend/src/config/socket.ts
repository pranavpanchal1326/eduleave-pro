import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('✅ Socket.IO initialized');

  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};
