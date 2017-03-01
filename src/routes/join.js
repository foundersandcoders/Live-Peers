const Rooms = require('../rooms');

module.exports = {
  method: 'POST',
  path: '/join',
  handler: (req, reply) => {
    let roomId = req.payload.roomId;
    let roomName = req.payload.roomName;
    let username = req.payload.username;
    if (usernameIsInRoom(roomId, username)) {
      let data = {
        roomId,
        roomName,
        errorMessage: 'That username is taken. Please choose another name.'
      };
      reply.view('join', data);
    }
    else {
      let endpointId = Math.random().toString(36).slice(2); // endpointId = new endpoint
      let permissions = ['CHAT'];
      Rooms[roomId].addEndpoint(endpointId);
      Rooms[roomId].updateUsername(endpointId, username);
      Rooms[roomId].updatePermissions(endpointId, permissions);
      req.cookieAuth.set({ roomId, endpointId });
      reply.redirect('/');
    }
  }
};

const usernameIsInRoom = (givenRoom, givenUsername) => {
  for (let endpoint in Rooms[givenRoom].endpoints) {
    let usernameInRoom = Rooms[givenRoom].getUsername(endpoint);
    if (givenUsername === usernameInRoom) {
      return true;
    }
  }
  return false;
};
