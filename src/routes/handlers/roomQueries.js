const Rooms = require('../../rooms.js');

const getRoomData = (room) => {
  if (Rooms[room]) {
    let roomData = {
      roomId: room,
      roomName: Rooms[room].roomName
    };
    return roomData;
  }
  else {
    return { errorMessage: "Bad roomId" };
  }
};

const getUserData = (room, endpoint) => {
  if (Rooms[room]) {
    if (Rooms[room].endpoints[endpoint]) {
      let roomData = {
        roomId: Rooms[room],
        roomName: Rooms[room].roomName,
        endpointId: Rooms[room].endpoints[endpoint],
        username: Rooms[room].endpoints[endpoint].username,
        permissions: Rooms[room].endpoints[endpoint].permissions
      };
      return roomData;
    }
    else {
      return { errorMessage: "Bad endpointId" };
    }
  }
  else {
    return { errorMessage: "Bad roomId"};
  }
};

module.exports = {
  getRoomData,
  getUserData
};
