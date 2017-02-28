class Room {
  constructor (username, roomname) {
    this.roomname = roomname;
    this.pin = Math.floor(Math.random() * 10000);
    this.endpoints = {};
  }
  createEndpointId () {
    return Math.random().toString(36).slice(2);
  }
  addEndpoint (endpointId) {
    this.endpoints[endpointId] = {};
  }
  updateUsername (endpointId, username) {
    this.endpoints[endpointId]['username'] = username;
  }
  updatePermissions (endpointId, permissions) {
    this.endpoints[endpointId]['permissions'] = permissions;
  }
  getRoomName () {
    return this.roomname;
  }
  getEndpointId (endpointId) {
    return this.endpoints.endpointId;
  }
}
module.exports = Room;
