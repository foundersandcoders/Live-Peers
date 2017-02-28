const Rooms = require('../../rooms.js');

module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    // Student given URL by Mentor: livepeers.com?roomId=3hg3084
    if (req.query.roomId) {
      // If cookie called LivePeers
      if (req.auth.isAuthenticated) {
        let roomId = req.auth.credentials.roomId;
        let endpointId = req.auth.credentials.endpointId;
        if (isValidRoomCredentials(roomId, endpointId)) {
          let data = getMainViewData(roomId, endpointId);
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

// 1 Check to see if Room & endpoint exist in Rooms
const isValidRoomCredentials = (roomId, endpointId) => {
  if (Rooms[roomId] && Rooms[roomId].endpoints[endpointId]) {
    return true;
  }
  else {
    return false;
  }
};
// 2 Prepare Room Data
const getMainViewData = (roomId, endpointId) => {
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
