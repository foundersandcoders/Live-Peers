// WebRTC
class Comms {
  constructor (signaller) {
    this.signaller = signaller;
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
    this.signaller.globalMessage(msg);
  }
  // Called externally to send a global message
  privateMessage (id, msg) {
    this.signaller.privateMessage(msg);
  }
}

module.exports = Comms;
