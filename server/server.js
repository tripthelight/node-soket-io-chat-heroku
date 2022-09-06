const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const PORT = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('A new user just connected :)');

  socket.on('disconnect', () => {
    console.log('User was Disconnect :(');
  });
});



server.listen(PORT, () => {
  console.log('Server is Running :)', PORT);
});
