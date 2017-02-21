module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    if (req.auth.isAuthenticated) {
      let config = {};
      /*
      get roomname, roomid and endpointid and inject it into view
      */
      reply.view('home', config);
    } else if (req.query) {
      // If student is trying to join room
      let roomid = req.query.roomid;
      let config = {};
      // Look up room details and store in config
      reply.view('chat-only', config);
    } else {
      reply.view('create');
    }
  }
};
