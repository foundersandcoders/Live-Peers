// TEMP. Require room
const room = require('../myroom.js');
const roomname = Object.keys(room).toString();

// TEMP. Send if not authenticated (when initiating webrt)
const deniedmsg = (from, to) => {
  return JSON.stringify({
    roomid: roomname,
    from: from,
    to: to,
    app: 'WEBRTC',
    method: 'CALL',
    params: 'DENIED'
  });
};

const servercomms = (io, ws, msg) => {
  // TEMP. Return if no msg (disconnected socket)
  if (!msg) return;
  // Parse message
  const parsed = JSON.parse(msg);
  // Extract data
  const from = parsed.from;
  const to = parsed.to;
  const app = parsed.app;
  const params = parsed.params;

  const route = `${app}`;

  switch (route) {
    // Chatroom example...
    case ('CHATROOM') : {
      // add endpoint Object, with socketid and permissions
      room[roomname][params].socketid = ws.id;
      io.emit('message', msg);
      break;
    }
    case ('WEBRTC') : {
      // Only send message to other party if authenticated
      if (room[roomname][from].permissions === 'av') {
        const wsid = room[roomname][to].socketid;
        ws.broadcast.to(wsid).emit('message', msg);
      } else {
        // Else send denied msg
        ws.emit('message', deniedmsg(from, to));
      }
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
      // dont send empty message
      servercomms(io, ws);
    });
  });
};
