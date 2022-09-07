const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '/../public');
const PORT = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('A new user just connected :)');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app :)'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined :)'));

  socket.on('createMessage', (message, callback) => {
    console.log('Create Message : ', message);
    
    // 나와 다른 user 모두 보임
    io.emit('newMessage', generateMessage(message.from, message.text));

    callback('This is the Server :)');

    // 나는 못보고 다른 user는 보임
    // socket.broadcast.emit('newMessage', {
    //   form: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
  });

  socket.on('disconnect', () => {
    console.log('User was Disconnect :(');
  });
});

server.listen(PORT, () => {
  console.log('Server is Running :)', PORT);
});
