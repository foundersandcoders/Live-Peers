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
    } else {
      reply.view('create');
    }
  }
};
