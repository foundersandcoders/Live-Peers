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
          let data = getMainViewData(req.auth.credentials);
          reply.view('main', data);
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
        let data = getMainViewData(req.auth.credentials);
        reply.view('main', data);
      }
      else {
        reply.view('create');
      }
    }
  }
};

const getMainViewData = function (cookieCredentials) {
  let roomId = cookieCredentials.roomId;
  let endpointId = cookieCredentials.endpointId;

  let data = {
    roomId,
    endpointId,
    roomName: Rooms.roomId.getroomName(),
    username: Rooms.roomId.getUsername(endpointId),
    permissions: Rooms.roomId.getPermissions(endpointId)
  };

  if (Rooms.roomId.getPermissions().includes('AV')) {
    data['pin'] = Rooms.roomId.getPin();
  }

  return data;
};
