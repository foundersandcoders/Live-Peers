const { getRoomData, getUserData } = require('./handlers/roomQueries');

module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    // Student branch
    if (req.query.roomId) {
      console.log(req.query.roomId);
      if (req.auth.credentials) {
        if (req.auth.isAuthenticated) {
          let roomId = req.auth.credentials.roomId;
          let endpointId = req.auth.credentials.endpointId;
          let roomData = getUserData(roomId, endpointId);
          reply.view('main', roomData);
        }
        else {
          reply.view('join', { errorMessage: "Incorrect credentials" });
        }
      }
      else {
        let roomId = req.query.roomId;
        let roomData = getRoomData(roomId);
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
