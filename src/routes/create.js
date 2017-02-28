const Rooms = require('../../rooms.js');
const Room = require('../../room.js');

module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    // Verify username and password - in a later sprint
    // if (user is authenticated) {
    let username = req.body.username;
    let roomName = req.body.roomName;
    let roomId = Math.random().toString(36).slice(2);
    roomId = new Room(username, roomName, permissions);

    let endpointId = Room.roomId.createEndpointId();
    let permissions = ['CHAT', 'AV'];
    Room.roomId.addEndpoint(endpointId);
    Room.roomId.updateUsername(endpointId, username);
    Room.roomId.updatePermissions(endpointId, permissions);

    let data = {
      roomId: roomId,
      roomName: roomName,
      endpointId: endpointId,
      username: username,
      permissions: permissions
    };

    req.cookieAuth.set({ roomId: roomId, endpointId: endpointId });

    reply.view('main', data);
    // } else {
    //   let loginfailmessage = checkLoginDetails()
    //     where checkLoginDetails returns { wrongUsernameMessage, wrongPasswordMessage}
    //   reply.view('create', loginfailmessage);
    // }
  }
};
