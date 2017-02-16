// This comms will be loaded into each client, will use the socket.io library

// comms.js
function Comms (roomId, endpointId) {
  this.endpointid = endpointId;
  this.roomid = roomId;
  this.handlers = {};
  Comms.endpoints[this.endpointid] = this;
  this.ws = io(); // global io() function made available via web sockets
  var self = this;
  this.ws.on('message', function (msg) {
    msg = JSON.parse(msg);
    self.handlers[msg.app + '.' + msg.method](this, msg.from, msg.params);
  });
}

Comms.endpoints = {}; // Holds endpoints

Comms.getEndPointID = function (endpointId) { // Get endpoints
  return Comms.endpoints[endpointId];
};

// This function is called by wecrtc.js, av.js and chat.js when registering
Comms.prototype.registerHandler = function (app, method, cb) {
  var fullName = app + '.' + method;
  this.handlers[fullName] = cb;
};

Comms.prototype.send = function (app, method, to, params) {
  this.ws.emit('message', JSON.stringify({
    roomId: this.roomId, from: this.endpointid, to: to, app: app, method: method, params: params
  }));
};
