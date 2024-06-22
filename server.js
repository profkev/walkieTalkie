const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Namespace for walkie-talkie
const walkieTalkie = io.of('/walkieTalkie');

walkieTalkie.on('connection', (socket) => {
  console.log('a user connected to walkieTalkie namespace');

  // Join a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle voice data
  socket.on('voice', (data) => {
    const room = data.room;
    socket.to(room).emit('voice', data.audio);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
