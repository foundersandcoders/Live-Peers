class ChatRoom {

  constructor (roomName) {
    this.roomName = roomName;
    this.endpoints = {};
  }

  addEndpoint (endpointID) {
    this.endpoints[endpointID] = {
      permission: 'CHAT'
    };
  }

}

// mock
let FACN = new ChatRoom('FACN');
