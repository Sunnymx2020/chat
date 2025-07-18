const express = require('express');
const http = require('http');
const { exec } = require('child_process');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Execute commands
  socket.on('execute', (command) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        socket.emit('output', `Error: ${error.message}\n`);
        return;
      }
      if (stderr) {
        socket.emit('output', `Stderr: ${stderr}\n`);
      }
      socket.emit('output', stdout);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
