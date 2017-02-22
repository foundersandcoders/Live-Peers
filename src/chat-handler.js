
const chatHandler = (route, data) => {
  switch (route) {
    case ('CHATROOM.REGISTER') : {
      newuser = new NewUser(data);
      newuser.isValid();
      break;
    }

    case ('CHATROOM.MESSAGE') : {
      io.emit('message', data);
      break;
    }

    case ('CHATROOM.DISCONNECT') : {
      // user close window
      break;
    }
  }
};

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    chatHandler('CHATROOM.MESSAGE', message);
  });
  // TODO
  // socket.one('disconnect'..)
});
