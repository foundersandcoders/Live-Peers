module.exports = {
  method: 'POST',
  path: '/join',
  handler: (req, reply) => {
    // Student wants to join...
    // get their post params
    let name = req.query.name;
    // Store name, create endpoint for them,
    let config = {};
    config.name = name;
    // Store name, endpointid, roomid in config, then serve view
    reply.view('create', config);
  }
};
