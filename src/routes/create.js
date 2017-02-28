const Rooms = require('../rooms.js');
const Room = require('../room.js');

module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    let username = req.body.username;
    let roomName = req.body.roomName;
    let roomId = Math.random().toString(36).slice(2);
    let pin = Math.floor(Math.random() * 8000) + 1000;
    let endpointId = Math.random().toString(36).slice(2);
    let permissions = ['CHAT', 'AV'];
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
