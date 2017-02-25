// IMPORT ROOM
const myroom = require('../../myroom');
// RANDOM STRING
const randomstring = () => {
  return Math.random().toString(36).split('').filter((value, index, self) => {
    return self.indexOf(value) === index;
  }).join('').substr(2, 8);
};

module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    // Make random endpoint name
    const endpointid = randomstring();
    // Add roomid
    const roomname = Object.keys(myroom).toString();
    // Add new endpoint to room
    myroom[roomname].endpoints[endpointid] = {
      socketid: '',
      permissions: 'av'
    };
    reply.view('av-chat', {endpointid, roomname});
  }
};
