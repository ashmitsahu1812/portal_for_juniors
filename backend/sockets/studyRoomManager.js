export function initStudyRoomManager(io) {
  const studyRoomNamespace = io.of('/study-room');

  // Track online users in the study room
  // Map of socket.id -> { userId, name, email, joinedAt }
  const activeUsers = new Map();

  studyRoomNamespace.on('connection', (socket) => {
    // When a user explicitly joins the study room
    socket.on('joinStudyRoom', (userData) => {
      // userData should have { id, name, email }
      if (!userData || !userData.id) return;

      const userInfo = {
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        joinedAt: new Date().toISOString()
      };

      activeUsers.set(socket.id, userInfo);

      // Broadcast the updated list to all connected clients in this namespace
      broadcastActiveUsers();
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (activeUsers.has(socket.id)) {
        activeUsers.delete(socket.id);
        broadcastActiveUsers();
      }
    });

    // Utility to broadcast the unique active users
    function broadcastActiveUsers() {
      // Convert map to array. Handle potential multiple tabs from same user by picking unique userIds.
      const uniqueUsersMap = new Map();
      for (const [_, user] of activeUsers.entries()) {
        if (!uniqueUsersMap.has(user.userId)) {
          uniqueUsersMap.set(user.userId, user);
        } else {
          // If already exists, keep the earliest joinedAt
          const existing = uniqueUsersMap.get(user.userId);
          if (new Date(user.joinedAt) < new Date(existing.joinedAt)) {
            uniqueUsersMap.set(user.userId, user);
          }
        }
      }
      
      const usersList = Array.from(uniqueUsersMap.values());
      studyRoomNamespace.emit('activeUsersUpdate', usersList);
    }
  });
}
