class Room {

  constructor (roomname) {
    this.roomname = roomname;
    this.endpoints = {};
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
  updateCommsId (endpointId, commsId) {
    this.endpoints['endpointId']['commsId'] = commsId;
  }
  removeEndpoint (endpointId) {
    delete this.endpoints[endpointId];
  }
  getRoomName () {
    return this.roomname;
  }
  getPin () {
    return this.pin;
  }
  getUsername (endpointId) {
    return this.endpoints[endpointId].username;
  }
  getPermissions (endpointId) {
    return this.endpoints[endpointId].permissions;
  }
  getEndpointNameFromCommsID (commsId) {
    for (let props in this.endpoints) {
      if (this.endpoints[props].commsId === commsId) {
        return props;
      }
    }
  }
  getCommsId (endpointId) {
    return this.endpoints[endpointId].commsId;
  }
}
module.exports = Room;
