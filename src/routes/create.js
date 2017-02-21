module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    // Mentor signing in & creating room
    if (req.auth.isAuthenticated) {
      // if authentiated, process create POST (store new room & endpoint), then redirects to home
      reply.redirect('/');
    } else {
      let loginfailmessage = {};
      // Make fail message
      reply.view('create', loginfailmessage);
    }
  }
};
