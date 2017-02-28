const displayTextMessage = (data) => {
  let usernameSpan = document.createElement('span');
  let messageSpan = document.createElement('span');
  usernameSpan.innerHTML = `${data.username}`;
  messageSpan.innerHTML = `${data.message}`;
  document.getElementsByClassName('chat__messages')[0].appendChild(usernameSpan);
  document.getElementsByClassName('chat__messages')[0].appendChild(messageSpan);
};
