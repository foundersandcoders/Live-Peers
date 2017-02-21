module.exports = {
  method: ['GET', 'POST'],
  path: '/',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    },
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: false
      },
      handler: (req, reply) => {
        if (req.method === 'get') {
          if (req.auth.isAuthenticated) {
            // Serve av-chat view
          } else {
            // Serve create view
          }
        } else {
          // Process create POST (store new room & endpoint) set Cookie and redirect to '/'
        }
      }
    }
  }
};
