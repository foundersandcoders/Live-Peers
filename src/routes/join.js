const Rooms = require('../rooms');

module.exports = {
  method: 'POST',
  path: '/join',
  handler: (req, reply) => {
    let roomId = req.body.roomId;
    let roomName = req.body.roomName;
    let username = req.body.username;
    if (usernameIsInRoom(roomId, username)) {
      let data = {
        roomId,
        roomName,
        errorMessage: 'That username is taken. Please choose another name.'
      };
      reply.view('login', data);
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
  for (let endpoint in Rooms[givenRoom]) {
    let usernameInRoom = Rooms[givenRoom].getUsername(endpoint);
    if (givenUsername === usernameInRoom) {
      return true;
    }
  }
  return false;
};
