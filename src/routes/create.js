module.exports = {
  method: 'POST',
  path: '/create',
  handler: (req, reply) => {
    // Logic to handle if authenticated
    // if authentiated, process create POST (store new room & endpoint), then
    reply.redirect('/');
    // else
    let loginfailmessage = {};
    reply.view('create', loginfailmessage);
  }
};
