const signaller = (io) => {
  return {
    /* Sending Methods */
    sendGlobalMessage: (msg) => {
      // Sends message to entire room
      io.emit('message', msg);
    },
    sendPrivateMessage: (receiver, msg) => {
      // Sends message to one client (requires socket id)
      io.to(receiver).emit('message', msg);
    },
    /* Receiving Methods */
    onMessage: (callback) => {
      io.on('connection', (ws) => {
        // Registers callback for message, on message calls the callback
        ws.on('message', (msg) => callback(msg, ws.id));
      });
    },
    onDisconnect: (callback) => {
      io.on('connection', (ws) => {
        // Registers callback to handle disconnect, on disconnect calls the callback with websocket id
        ws.on('disconnect', () => callback(ws.id));
      });
    }
  };
};

// Comms class to seperate socket.io logic
class Comms {
  constructor (Signaller) {
    this.signaller = Signaller;
  }
  // Register a function which is bound to the comms instance
  registerOnMessageHandler (handler) {
    this.signaller.onMessage(handler);
  }
  // Register a function which is bound to the comms instance
  registerOnDisconnectHandler (handler) {
    this.signaller.onDisconnect(handler);
  }
  // Called externally to send a global message
  globalMessage (msg) {
    this.signaller.sendGlobalMessage(msg);
  }
  // Called externally to send a global message
  privateMessage (id, msg) {
    this.signaller.sendPrivateMessage(id, msg);
  }
}

module.exports = (io) => new Comms(signaller(io));
