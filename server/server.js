const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const PORT = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('A new user just connected :)');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room are required');
    }

    // console.log(socket.id);
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} :)`));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'New User Joined :)'));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // console.log('Create Message : ', message);
    
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      // 나와 다른 user 모두 보임
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is the Server :)');

    // 나는 못보고 다른 user는 보임
    // socket.broadcast.emit('newMessage', {
    //   form: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng))
    }
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room.`))
    }
  });
});

server.listen(PORT, () => {
  console.log('Server is Running :)', PORT);
});
