class Room {

  constructor (roomname) {
    this.roomname = roomname;
    this.endpoints = {};
  }
  addEndpoint (endpointId) {
    this.endpoints[endpointId] = {
      name: '',
      permissions: 'CHAT',
      commsid: ''
    };
  }
  updateEndpointName (endpointId, Name) {
    this.endpoints[endpointId].name = Name;
  }
  updateEndpointPermissions (endpointId, permissions) {
    this.endpoints[endpointId].permissions = permissions;
  }
  updateEndpointCommsID (endpointId, commsid) {
    this.endpoints[endpointId].commsid = commsid;
  }
  removeEndpoint (endpointId) {
    delete this.endpoints[endpointId];
  }
  getRoomName () {
    return this.roomname;
  }
  getEndpointNameFromCommsID (commsid) {
    for (let props in this.endpoints) {
      if (this.endpoints[props].commsid === commsid) {
        return props;
      }
    }
  }
}
module.exports = Room;
