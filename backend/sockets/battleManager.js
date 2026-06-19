import Problem from '../models/Problem.js';
import User from '../models/User.js';

// In-memory store for active rooms
// rooms[roomId] = { difficulty, players: [{ socketId, name, userId }], problemId: null, started: false }
const rooms = {};

const POINTS_MAP = {
  'Easy': 10,
  'Medium': 30,
  'Hard': 50
};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function initBattleManager(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Create a new room
    socket.on('create_room', ({ userName, userId, difficulty }) => {
      const roomId = generateRoomCode();
      rooms[roomId] = {
        difficulty: difficulty || 'Medium',
        players: [{ socketId: socket.id, name: userName, userId }],
        problemId: null,
        started: false
      };
      socket.join(roomId);
      socket.emit('room_created', { roomId, difficulty: rooms[roomId].difficulty });
      console.log(`[Socket] Room ${roomId} created by ${userName}`);
    });

    // Join an existing room
    socket.on('join_room', ({ roomId, userName, userId }) => {
      const room = rooms[roomId];
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }
      if (room.players.length >= 2) {
        return socket.emit('error', { message: 'Room is full' });
      }
      if (room.started) {
        return socket.emit('error', { message: 'Battle has already started' });
      }

      room.players.push({ socketId: socket.id, name: userName, userId });
      socket.join(roomId);
      
      // Notify both players that the room is ready
      io.to(roomId).emit('player_joined', { 
        players: room.players,
        difficulty: room.difficulty
      });
      console.log(`[Socket] ${userName} joined room ${roomId}`);
    });

    // Start battle (callable by room creator when 2 players are in)
    socket.on('start_battle', async ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.players.length < 2) return;

      try {
        // Fetch a random problem of the selected difficulty
        const count = await Problem.countDocuments({ difficulty: room.difficulty });
        if (count === 0) {
          return io.to(roomId).emit('error', { message: `No ${room.difficulty} problems found in database.` });
        }
        
        const random = Math.floor(Math.random() * count);
        const problem = await Problem.findOne({ difficulty: room.difficulty }).skip(random);

        room.problemId = problem._id;
        room.started = true;

        io.to(roomId).emit('battle_started', { 
          problemId: problem._id,
          title: problem.title,
          difficulty: problem.difficulty,
          startTime: Date.now()
        });
      } catch (err) {
        console.error('[Socket] Error starting battle:', err);
        io.to(roomId).emit('error', { message: 'Failed to start battle' });
      }
    });

    // Relay player status updates (typing, compiling, etc.)
    socket.on('player_status', ({ roomId, status }) => {
      // Broadcast to others in the room
      socket.to(roomId).emit('opponent_status', { 
        socketId: socket.id,
        status 
      });
    });

    // Player wins
    socket.on('player_won', async ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return;

      const winner = room.players.find(p => p.socketId === socket.id);
      if (!winner) return;

      const points = POINTS_MAP[room.difficulty] || 10;
      
      io.to(roomId).emit('game_over', { 
        winnerId: winner.userId,
        winnerName: winner.name,
        pointsAwarded: points
      });

      // Update Database Rating
      try {
        await User.findByIdAndUpdate(winner.userId, {
          $inc: { 'progress.rating': points }
        });
      } catch (err) {
        console.error('[Socket] Failed to update battle rating', err);
      }

      // Cleanup room
      delete rooms[roomId];
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
      // Find any room this user was in and remove them
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          // If room is now empty, delete it
          if (room.players.length === 0) {
            delete rooms[roomId];
          } else {
            // Notify remaining player
            socket.to(roomId).emit('opponent_disconnected');
            room.started = false; // Reset state if someone leaves
          }
        }
      }
    });
  });
}
