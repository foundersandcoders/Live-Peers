// Main comms class
class Comms {

  // Takes endopint and room ID
  constructor (roomId, endpointId) {
    var self = this;
    this.endpointid = endpointId;
    this.externalendpoints = new Set();
    this.roomid = roomId;
    this.handlers = {};
    this.ws = io();

    this.ws.on('message', function (msg) {
      msg = JSON.parse(msg);
      // Simply calls the handler with 'from' and 'params' (not self)
      self.handlers[msg.app + '.' + msg.method](msg.sender, msg.params);
    });

    Comms.endpoints[this.endpointid] = this;
  }

  // Register Handler
  registerHandler (app, method, cb) {
    this.handlers[`${app}.${method}`] = cb;
  }
  // Add external endpoint
  addExternalEndpoint (endpoint) {
    this.externalendpoints.add(endpoint);
  }

  // Send Method
  send (app, method, receiver, params) {
    this.ws.emit('message', JSON.stringify({
      roomId: this.roomId,
      sender: this.endpointid,
      receiver: receiver,
      app: app,
      method: method,
      params: params
    }));
  }

}

// Get endpoint Id (useful when client has multiple endpoints)
Comms.getEndPointID = (endpointId) => Comms.endpoints[endpointId];

// Global endpoints
Comms.endpoints = {};
