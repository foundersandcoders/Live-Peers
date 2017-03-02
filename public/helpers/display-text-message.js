const displayTextMessage = (data) => {
  let messageWrapper = document.createElement('div');
  let usernameSpan = document.createElement('span');
  let messageSpan = document.createElement('span');
  usernameSpan.innerHTML = `${data.username}`;
  messageSpan.innerHTML = `${data.message}`;
  messageWrapper.appendChild(usernameSpan);
  messageWrapper.appendChild(messageSpan);
  messageWrapper.className = "chat__message";
  usernameSpan.className = "chat__message-username";
  messageSpan.className = "chat__message-text";
  document.querySelector('.chat__messages').appendChild(messageWrapper);
};
