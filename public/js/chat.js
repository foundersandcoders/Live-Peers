let register = document.getElementById('register');
let message = document.getElementsByClassName('message');
let send = document.getElementById('send');
// let username = document.getElementById('username');

register.addEventListener('click', () => {
  // registeration proccess(creating new user, making sure the username is not exist in the room, adding the user endpoint to the specific room endpoints list)
});

comms.registerHandler('CHATROOM', 'REGISTER', /*TODO*/);
comms.registerHandler('CHATROOM', 'MESSAGE', /*TODO*/);
comms.registerHandler('CHATROOM', 'DISCONNECT', /*TODO*/);

send.addEventListener('click', () => {
  comms.send('CHATROOM', 'TEXTMESSAGE', 'roomid', message.value);
  displayTextMessage(data);
  message.value = '';
});
