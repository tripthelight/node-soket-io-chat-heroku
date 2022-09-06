let socket = io();

socket.on('connect', function () {
  console.log('connect to Server');
});

socket.on('disconnect', function () {
  console.log('disconnect from Server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage : ', message);
});
