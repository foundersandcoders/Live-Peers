// Get global rooms object
const Rooms = require('./rooms.js');
// Socketcomms
const Comms = require('./socketcomms');

// Finds the endpoint ID by searching through all objects
// Returns the room and the endpoint (as object)
const locateEndpointIdFromCommsId = (rooms, commsid) => {
  for (let room in rooms) {
    let endpointSearch = Rooms[room].getEndpointNameFromCommsID(commsid);
    if (endpointSearch) {
      return {
        room: room,
        endpointid: endpointSearch
      };
    }
  }
};

module.exports = (io) => {
  // For all incoming, new, and disconnected sockets
  const MessageRouter = Comms(io);
  MessageRouter.registerOnMessageHandler((msg, commsid) => {
    // Parse message
    const parsed = JSON.parse(msg);
    const roomId = parsed.roomId;
    const sender = parsed.sender;
    const receiver = parsed.receiver;
    const app = parsed.app;
    const method = parsed.method;
    // For private messages in WebRTC
    switch (app) {
    case ('CHATROOM') : {
      if (method === 'REGISTER') {
          // Add Comms ID
        Rooms[roomId].updateCommsId(sender, commsid);
          // Send global message to other endpoints
          // Message contains the new user (send)
          // and active users in the room
        MessageRouter.sendGlobalMessage(JSON.stringify({
          roomId: roomId,
          sender: sender,
          receiver: '',
          app: 'CHATROOM',
          method: 'REGISTER',
          params: Rooms[roomId].getActiveUsers()
        }));
      } else if (method === 'MESSAGE') {
          // Send global message
        MessageRouter.sendGlobalMessage(msg);
      }
      break;
    }
    case ('WEBRTC') : {
        // Get receivers comms ID
      const receiverCommsId = Rooms[roomId].getCommsID(receiver);
        // If sender has permissions, then send the message to the receiver
      if (Rooms[roomId].getPermissions.includes('av')) {
        MessageRouter.sendPrivateMessage(receiverCommsId, msg);
      } else {
        MessageRouter.sendPrivateMessage(commsid, JSON.stringify({
          roomId: roomId,
          sender: sender,
          receiver: receiver,
          app: app,
          method: method,
          params: 'INVALID PERMISSIONS'
        }));
      }
      break;
    }
    default : return;
    }
  });
  MessageRouter.registerOnDisconnectHandler((commsid) => {
    // Get endpoint name when their socket has disconnected
    const disconnected = locateEndpointIdFromCommsId(Rooms, commsid);
    // Remove the comms id associated to the socket
    Rooms[disconnected.room].removeCommsId(disconnected.endpointid);
    // Send global message on disconnect
    // Each client module can handle the SYSTEM DISCONNECT method accordingly
    // params is an array of active users in the room
    MessageRouter.sendGlobalMessage(JSON.stringify({
      roomId: disconnected.room,
      sender: disconnected.endpointid,
      receiver: '',
      app: 'SYSTEM',
      method: 'DISCONNECT',
      params: Rooms[disconnected.room].getActiveUsers()
    }));
  });
};
