const Rooms = require('../rooms.js');
const Room = require('../room.js');

module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    let username = req.payload.username;
    let roomName = req.payload.roomName;
    let roomId = Math.random().toString(36).slice(2);
    let pin = Math.floor(Math.random() * 8000) + 1000;
    let endpointId = Math.random().toString(36).slice(2);
    let permissions = ['CHAT']; // Will be CHAT and AV by default in a future sprint
    Rooms[roomId] = new Room(roomName);
    Rooms[roomId].addPin(pin);
    Rooms[roomId].addEndpoint(endpointId);
    Rooms[roomId].updateUsername(endpointId, username);
    Rooms[roomId].updatePermissions(endpointId, permissions);

    req.cookieAuth.set({
      roomId,
      endpointId
    });

    reply.redirect('/');
  }
};
