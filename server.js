const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use Redis adapter for scaling
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

app.use(express.static('public'));

io.of('/walkieTalkie').on('connection', (socket) => {
  console.log('a user connected to walkieTalkie namespace');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

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
