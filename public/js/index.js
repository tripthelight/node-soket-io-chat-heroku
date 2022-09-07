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

socket.emit('createMessage', {
  from: 'HI~HI~',
  text: 'HO~ HO~ :)'
}, function(message) {
  console.log('Got it :) ', message);
});

document.querySelector('#submit-btn').addEventListener('click', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: "User",
    text: document.querySelector('input[name="message"]').value
  }, function() {

  });
});