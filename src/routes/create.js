module.exports = {
  method: ['GET', 'POST'],
  path: '/create',
  handler: (req, reply) => {
    if (req.method === 'get') {
          // Serve create post
    } else {
          // Process create POST (store new room & endpoint) set Cookie and redirect to '/'
    }
  }
};
