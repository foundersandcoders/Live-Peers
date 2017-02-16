// Example of how this module will interact with comms
//
// mycomms = new Comms('sdf', 'sdgsdg');
//
// mycomms.registerHandler('WEBRTC', 'OFFER', function(comms, from, params){
//   store_locAL_offer(params.offer);
//   comms.send('WEBRTC', 'ANSWER',from, {});
// })
