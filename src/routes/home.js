module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    if (req.query) {
      // If student is trying to join room
      if (req.auth.isAuthenticated) {
        // 4. Student is authenticate serve them chat only
        // get roomname, roomid from cookie and store in config, then serve chat only view
        let config = {};
        reply.view('chat-only', config);
      } else {
        // 3. Student wants to join room
        // get roomname, roomid then serve view (with roomid and roomname params)
        let config = {};
        reply.view('join', config);
      }
    } else {
      if (req.auth.isAuthenticated) {
        // 2. Mentor (with cookie) gets av-chat
        let config = {};
        // get roomname, roomid and endpointid and inject it into view
        reply.view('av-chat', config);
      } else {
        // 1. Mentor creates room
        reply.view('create');
      }
    }
  }
};
