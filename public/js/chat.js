let socket = io();

function scrollToBottom() {
  let messages = document.getElementById('messageList').lastElementChild;
  messages.scrollIntoView();
}

socket.on('connect', function () {
  // console.log('connect to Server');
  let searchQuery = window.location.search.substring(1);
  let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

  socket.emit('join', params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else {
      console.log('No Error, Connect OK :)');
    }
  })
});

socket.on('disconnect', function () {
  console.log('disconnect from Server');
});

socket.on('updateUsersList', function(users) {
  let usersWrap = document.createElement('ul');
  users.forEach(function(user) {
    let li = document.createElement('li');
    li.innerHTML = user;
    usersWrap.appendChild(li);
  });

  let usersList = document.getElementById('users');
  usersList.innerHTML = '';
  usersList.appendChild(usersWrap);
});

/**
 * document draw message in li
 */
socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });
  const ON_LI = document.createElement('li');
  ON_LI.innerHTML = html;
  document.getElementById('messageList').appendChild(ON_LI);

  scrollToBottom();
  // console.log('newMessage : ', message);
  // const formattedTime = moment(message.createdAt).format('LT');
  // const list = document.querySelector('.message-block dt ul');
  // let li = document.createElement('li');
  // // li.innerText = `${message.from} : ${message.text}`;
  // li.innerText = message.from + ' ' + formattedTime + ' : ' + message.text;
  // list.appendChild(li);
});

/**
 * document draw location link in li
 */
socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('LT');
  
  const template = document.querySelector('#location-message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  const ON_LI = document.createElement('li');
  ON_LI.innerHTML = html;
  document.getElementById('messageList').appendChild(ON_LI);

  scrollToBottom();
  
  // console.log('newLocationMessage : ', message);
  // const formattedTime = moment(message.createdAt).format('LT');
  // const list = document.querySelector('.message-block dt ul');
  // let li = document.createElement('li');
  // let a = document.createElement('a');
  // li.innerText = message.from + ' ' + formattedTime + ' : ';
  // a.setAttribute('target', '_blank');
  // a.setAttribute('href', message.url);
  // a.innerText = 'My Current Location'; 
  // li.appendChild(a);
  // list.appendChild(li);
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