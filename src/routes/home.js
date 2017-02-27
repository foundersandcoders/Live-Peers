const Rooms = require('../../rooms.js');
const Room = require('../../room.js');

module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    // Student branch
    if (req.query.roomId) {
      if (req.auth.credentials) {
        if (req.auth.isAuthenticated) {
          let roomId = req.auth.credentials.roomId;
          let endpointId = req.auth.credentials.endpointId;
          let userData = getUserData(roomId, endpointId);
          reply.view('main', userData);
        }
        else {
          reply.view('join', { errorMessage: "Incorrect credentials" });
        }
      }
      else {
        let roomId = req.query.roomId;
        let roomData = Rooms[roomId].getroomName();
        reply.view('join', roomData);
      }
    }
    // Mentor branch
    else {
      if (req.auth.isAuthenticated) {
        let roomId = req.auth.credentials.roomId;
        let endpointId = req.auth.credentials.endpointId;
        let userData = getUserData(roomId, endpointId);
        reply.view('main', userData);
      }
      else {
        reply.view('create');
      }
    }
  }
};

const getUserData = (room, endpoint) => {
  let roomId = Rooms[room];
  let endpointId = Rooms[room][endpoint];

  let roomName = roomId.getroomName();
  let username = roomId.endpoints[endpointId].getUsername();
  let permissions = roomId.endpoints[endpointId].getPermissions();

  return { roomId, roomName, endpointId, username, permissions };
};
