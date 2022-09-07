let socket = io();

socket.on('connect', function () {
  console.log('connect to Server');
});

socket.on('disconnect', function () {
  console.log('disconnect from Server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage : ', message);
  const list = document.querySelector('.message-block dt ul');
  let li = document.createElement('li');
  // li.innerText = `${message.from} : ${message.text}`;
  li.innerText = message.from + ' : ' + message.text;
  list.appendChild(li);
});

socket.on('newLocationMessage', function (message) {
  console.log('newLocationMessage : ', message);
  const list = document.querySelector('.message-block dt ul');
  let li = document.createElement('li');
  let a = document.createElement('a');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', message.url);
  a.innerText = 'My Current Location'; 
  li.appendChild(a);
  list.appendChild(li);
});

// socket.emit('createMessage', {
//   from: 'HI~HI~',
//   text: 'HO~ HO~ :)'
// }, function(message) {
//   console.log('Got it :) ', message);
// });

/**
 * messge send button click event
 */
document.querySelector('#submit-btn').addEventListener('click', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: "User",
    text: document.querySelector('input[name="message"]').value
  }, function() {

  });
});

/**
 * location button click event
 */
 document.querySelector('#send-location').addEventListener('click', function(e) {
  if (!navigator.geolocation) return alert('Geolocation is not supported by your browser :(');

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }, function() {
    alert('Unable to fetch location. :(');
  });
});