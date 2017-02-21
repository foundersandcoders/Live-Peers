const av = require('./av');
const chat = require('./chat');
const comms = require('./comms');
const webrtc = require('./webrtc');

const result = av + chat + comms + webrtc;

console.log(result);
