class Room {
  constructor (roomname) {
    this.roomname = roomname;
    this.endpoints = {};
  }
  addPin (pin) {
    this.pin = pin;
  }
  addEndpoint (endpointId) {
    this.endpoints[endpointId] = {};
  }
  updateUsername (endpointId, username) {
    this.endpoints[endpointId].username = username;
  }
  updatePermissions (endpointId, permissions) {
    this.endpoints[endpointId].permissions = permissions;
  }
  updateCommsId (endpointId, commsId) {
    this.endpoints[endpointId].commsId = commsId;
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
  getAllEndpoints () {
    let eps = [];
    for (let endpoint in this.endpoints) {
      eps.push(endpoint);
    }
    return eps;
  }
  getEndpointNameFromCommsID (commsId) {
    for (let props in this.endpoints) {
      if (this.endpoints[props].commsId === commsId) {
        return props;
      }
    }
  }
  getEndpointsWithPermissions (perms) {
    let endpoints = [];
    for (let ep in this.endpoints) {
      let epPerms = this.endpoints[ep].permissions;
      if (epPerms.length == perms.length && epPerms.every((v, i) => v === perms[i])) {
        endpoints.push(ep);
      }
    }
    return endpoints;
  }
  getActiveUserDetails() {
    let users = [];
    for (let props in this.endpoints) {
      let endpoint = this.endpoints[props];
      if (endpoint.commsId) {
        users.push({
          username: endpoint.username,
          commsId: endpoint.commsId,
          permissions: endpoint.permissions
        });
      }
    }
    return users;
  }
  getCommsId (endpointId) {
    return this.endpoints[endpointId].commsId;
  }
  removeCommsId(endpointId) {
    delete this.endpoints[endpointId].commsId;
  }
}
module.exports = Room;
