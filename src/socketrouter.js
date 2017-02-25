// TEMP. Require room
const room = require('../myroom.js');
const roomname = Object.keys(room).toString();

const Comms = require('./socketcomms');

// On disconnect, find the endpoint from socket id (could be method on global rooms class)
const findEndpointFromID = (socketid) => {
  for (let endpoint in room[roomname].endpoints) {
    if (room[roomname].endpoints[endpoint].socketid === socketid) {
      return endpoint;
    }
  }
};

module.exports = (io) => {
  // For all incoming, new, and disconnected sockets
  const ChatRoomRouter = Comms(io);
  ChatRoomRouter.registerOnMessageHandler((msg, socketid) => {
    // Parse message
    const parsed = JSON.parse(msg);
    const to = parsed.to;
    const app = parsed.app;
    const method = parsed.method;
    const params = parsed.params;
    // For private messages in WebRTC
    switch (app) {
      case ('CHATROOM') : {
        if (method === 'REGISTER') {
          room[roomname].endpoints[params].socketid = socketid;
          ChatRoomRouter.globalMessage(msg);
        }
        break;
      }
      case ('WEBRTC') : {
        const socketid = room[roomname].endpoints[to].socketid;
        ChatRoomRouter.privateMessage(socketid, msg);
        break;
      }
      default : return;
    }
  });
  ChatRoomRouter.registerOnDisconnectHandler((socketid) => {
    // Remove socket id on disconnect
    const endpoint = findEndpointFromID(socketid);
    room[roomname].endpoints[endpoint].socketid = '';
  });
};
