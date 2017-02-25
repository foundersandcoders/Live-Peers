/* WebRTC Class (uses comms module) */

/* Usage Example

const mycomms = new Comms(roomname, endpointid)
const webrtc =  new WebRTC(mycomms);
      webrtc.addMyMediaStreamToVideo(ownvideoDOMelement)
      webrtc.peervideo = (peervideoDOMelement)
      webrtc.onRTC = () => {
        ownvideoDOMelement.classList.add('make-small')
      }
*/
