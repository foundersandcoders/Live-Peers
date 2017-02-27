const Rooms = require('../../rooms.js');

module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    // Verify username and password - in a later sprint
    // if (user is authenticated) {
      let roomId = Math.random().toString(36).slice(2);
      let endpointId = Math.random().toString(36).slice(2);

      let Rooms[roomId] = roomId;
      let Rooms[roomName] = req.body.roomName;
      let Rooms[req.body.pin] = Math.floor(Math.random() * 10000);
      let Rooms.endpoints[endpointId] = {
        username: req.body.username,
        permissions: ['CHAT', 'AV']
      };

      req.cookieAuth.set({ roomId: roomId, endpointId: endpointId });

      reply.redirect('/');
    // } else {
    //   let loginfailmessage = checkLoginDetails()
    //     where checkLoginDetails returns { wrongUsernameMessage, wrongPasswordMessage}
    //   reply.view('create', loginfailmessage);
    // }
  }
};
