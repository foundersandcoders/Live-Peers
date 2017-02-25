// Main Signaller module for Websockets
module.exports = (io) => {
  return {
    /* Sending Methods */
    globalMessage: (msg) => {
      // Sends message to entire room
      io.emit('message', msg);
    },
    privateMessage: (to, msg) => {
      // Sends message to one client (requires socket id)
      io.to(to).emit('message', msg);
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
