const Rooms = require('../rooms.js');

module.exports = {
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      }
    },
    handler: (req, reply) => {
      // If user has cookie called LivePeers
      if (req.auth.isAuthenticated) {
        let roomId = req.auth.credentials.roomId;
        let endpointId = req.auth.credentials.endpointId;
        // If user is has credentials for correct room
        if (isValidRoomCredentials(roomId, endpointId)) {
          let data = getMainViewData(roomId, endpointId);
          reply.view('main', data);
        }
        // If student is trying to join the wrong room
        else {
          reply.view('join', { errorMessage: "You're trying to join the wrong room, please ask your mentor for the correct url." });
        }
      }
      // If user doesn't have a cookie called LivePeers
      else {
        // Student is trying to join a room
        if (req.query.roomId) {
          // They will be using a URL given by a mentor e.g. livepeers.com?roomId=3hg3084
          let roomId = req.query.roomId;
          let roomData  = {
            roomName: Rooms[roomId].getroomName(),
            roomId: roomId
          };
          reply.view('join', roomData);
        }
        // Mentor is creating a new room
        else {
          reply.view('create');
        }
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
    roomName: Rooms[roomId].getRoomName(),
    username: Rooms[roomId].getUsername(endpointId)
  };

  if (Rooms[roomId].getPermissions(endpointId).includes('AV')) {
    data['pin'] = Rooms[roomId].getPin();
  }

  return data;
};
