// Get global rooms object
const Rooms = require('./rooms.js');
// Socketcomms
const Comms = require('./socketcomms');

// Finds the endpoint ID by searching through all objects
// Returns the room and the endpoint (as object)
const locateEndpointIdFromCommsId = (rooms, commsid) => {
  for (let room in rooms) {
    let endpointSearch = rooms[room].getEndpointNameFromCommsID(commsid);
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
    const params = parsed.params;

    // Message router
    switch (app) {
    case ('SYSTEM') : {
      if (method === 'REGISTER') {
          // (When client first registers their endpoint) add Comms ID
        Rooms[roomId].updateCommsId(sender, commsid);
          // Send message back to them with active users in the room
          // and active users in the room
        MessageRouter.privateMessage(commsid, JSON.stringify({
          roomId: roomId,
          sender: sender,
          receiver: '',
          app: 'SYSTEM',
          method: 'REGISTER',
          params: 'SUCCESS'
        }));
      }
      break;
    }
    case ('CHAT') : {
      if (method === 'MESSAGE') {
          // Send global chat message, with username of sender and their message
        MessageRouter.globalMessage(JSON.stringify({
          roomId: roomId,
          sender: sender,
          receiver: '',
          app: 'CHAT',
          method: 'MESSAGE',
          params: {username: Rooms[roomId].getUsername(sender), message: params}
        }));
      } else if (method === 'REGISTER') {
          // On register, send back message with active users
          // and active users in the room
        MessageRouter.privateMessage(commsid, JSON.stringify({
          roomId: roomId,
          sender: sender,
          receiver: '',
          app: 'CHAT',
          method: 'REGISTER',
          params: Rooms[roomId].getActiveUsers()
        }));
      }
      break;
    }
    case ('AV') : {
        // Get receivers comms ID
      const receiverCommsId = Rooms[roomId].getCommsID(receiver);
        // If sender has permissions, then send the message to the receiver
      if (Rooms[roomId].getPermissions(sender).includes('av')) {
        MessageRouter.privateMessage(receiverCommsId, msg);
      } else {
        MessageRouter.privateMessage(commsid, JSON.stringify({
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
    // Send disconnect message on disconnect
    // First, the chat module receives the 'DISCONNECT' method
    // with params as an array of active users
    MessageRouter.globalMessage(JSON.stringify({
      roomId: disconnected.room,
      sender: 'SYSTEM',
      receiver: '',
      app: 'CHAT',
      method: 'DISCONNECT',
      params: Rooms[disconnected.room].getActiveUsers()
    }));
    // Second, the AV module receives the 'DISCONNECT' message too
    // with params as the disconnected message
    MessageRouter.globalMessage(JSON.stringify({
      roomId: disconnected.room,
      sender: 'SYSTEM',
      receiver: '',
      app: 'AV',
      method: 'DISCONNECT',
      params: disconnected.endpointid
    }));
  });
};
