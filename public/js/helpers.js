// should edit
const ErrorUsernameTaken = () => {
  let error = '<p>username taken</p>';
  document.getElementById('message').insertAdjacentHTML('beforebegin', error);
  return;
};

const successUsername = (username) => {
  comms.roomid.addEndpoint(username);
  username.style.display = 'none';
  register.style.display = 'none';
  chat.style.display = 'block';
  message.style.display = 'block';
  send.style.display = 'block';
};
const displayTextMessage = (data) => {
  var li = document.createElement('li');
  li.innerHTML = `${data.message}`; // username should be added in here
  document.getElementById('messages').appendChild(li);
};
