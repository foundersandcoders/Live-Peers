// Require room

const servercomms = (io, ws, msg) => {
  // Parse message
  const parsed = JSON.parse(msg);
  // Extract data
  const to = parsed.to;
  const app = parsed.app;
  const method = parsed.method;

  const route = `${app}.${method}`;

  switch (route) {
    // Chatroom example...
    case ('CHATROOM.REGISTER') : {
      // add endpoint to room
      io.emit('message', msg);
      break;
    }
    case ('CHATROOM.MESSAGE') :
    case ('CHATROOM.DISCONNECT') :
    case ('CHATROOM.PRIVATEMESSAGE') : {
      io.broadcast.to(to).emit('message', msg);
      break;
    }
  }
};

// Main router
module.exports = (io) => {
  io.on('connection', (ws) => {
    ws.on('message', (msg) => {
      servercomms(io, ws, msg);
    });
    ws.on('disconnect', () => {
      let msg = 'disconnect';
      servercomms(io, ws, msg);
      // remove endpoint
    });
  });
};
