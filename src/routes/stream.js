module.exports = {
  path: '/stream',
  method: 'get',
  handler: (req, reply) => {
      // When moderators pop-window makes request to /stream, server serves the av view
    reply.view('av');
  }
};
