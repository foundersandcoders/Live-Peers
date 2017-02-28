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

class WebRTC {
  // Takes comms object initially
  constructor (comms) {
    this.comms = comms;
    this.app = 'AV';
    this.sys = 'SYSTEM'
    this.state = 'IDLE';
    this.party;
    // Register Handlers
    this.comms.registerHandler(this.app, 'CALL_REQUEST', this.requestIncomingCall.bind(this));
    this.comms.registerHandler(this.app, 'DENIED', this.callDenied.bind(this));
    this.comms.registerHandler(this.app, 'CALL_ACCEPT', this.callAccepted.bind(this));
    this.comms.registerHandler(this.app, 'OFFER', this.receivedIncomingSDPoffer.bind(this));
    this.comms.registerHandler(this.app, 'SDP_OFFER', this.receivedIncomingSDPoffer.bind(this));
    this.comms.registerHandler(this.app, 'ANSWER', this.receivedIncomingSDPanswer.bind(this));
    this.comms.registerHandler(this.app, 'SDP_ANSWER', this.receivedIncomingSDPanswer.bind(this));
    this.comms.registerHandler(this.app, 'CANDIDATE', this.receivedCandidate.bind(this));
    this.comms.registerHandler(this.app, 'END_CALL', this.endCall.bind(this));
    this.comms.registerHandler(this.app, 'DISCONNECT', this.disconnect.bind(this));

    // Callback register after complete
    this.onRTC = (func) =>

    // Callback register when client disconnects
    this.onEndCall = (func) =>

    // Holds peer video output
    this.peervideo;
  }
  // Gets owner media stream (returns a promise)
  getMediaStream () {
    if (this.localMediaPromise == null) {
      this.localMediaPromise = navigator.mediaDevices.getUserMedia(
        {video: true, audio: true});
    }
    return this.localMediaPromise;
  }

  // Takes DOM video element and adds media stream
  addMyMediaStreamToVideo (video) {
    return this.getMediaStream()
      .then((mediaStream) => {
        // Attach this stream to a video element...
        video.srcObject = mediaStream;
        // When meta data loaded, play
        video.onloadedmetadata = (e) => {
          video.play();
        };
        return;
      });
  }

  // Creates Peer Connection
  createPeerConnection (sender) {
    this.pc = new RTCPeerConnection();
    // Add Ice Candidate Listener
    this.pc.onicecandidate = (e) => {
      if (e.candidate != null) {
        this.comms.send(this.app, 'CANDIDATE', sender, e.candidate);
      }
    };
    // Add Add stream listener (incoming stream), and append to placeholder video element
    this.pc.onaddstream = (e) => {
      this.peervideo.srcObject = e.stream;
      this.peervideo.play();
      this.onRTC();
    };
    // Add stream for own stream
    var prom = this.getMediaStream();
    prom.then((stream) => this.pc.addStream(stream));
    // Return PC promise
    return prom;
  }

  // 1. Get video of peer
  callEndpoint (peerendpointid) {
    this.comms.send(this.app, 'CALL_REQUEST', peerendpointid, '');
  }

  // 2. Only accept a call if we're currently idle
  requestIncomingCall (sender) {
    if (this.state !== 'IDLE') {
      this.comms.send(this.app, 'DENIED', sender, '');
    } else {
      // Change call state to receiving
      this.state = 'RX';
      // Save endoint
      this.party = sender;
      // Set up pc, (prepare own media stream) then send accept message
      this.createPeerConnection(sender).then(() => {
        this.comms.send(this.app, 'CALL_ACCEPT', sender, '');
      });
      // Send accept message
    }
  }
  // Alert to say recipient is busy
  callDenied (sender) {
    alert("Can't call " + sender + ', the line is busy...');
  }

  // 3. Caller is notified the receiver has accepted the call
  callAccepted (sender) {
    // Change state to in call
    this.state = 'TX';
    // Save endpoint & send a call request
    this.party = sender;
    // Create peer connection
    this.createPeerConnection(sender).then(() => {
      // Make offers
      const offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
      };
      // then create offer of new PC
      this.pc.createOffer(
            offerOptions
          ).then((offer) => {
            // Save the offer description
            this.pc.setLocalDescription(offer);
            // Send the offer
            this.comms.send(this.app, 'OFFER', sender, offer);
          },
            // ... or reject handler
          (err) => console.log(err)
        );
    });
  }
  // 4. Save offer of other endpoint after accepted
  receivedIncomingSDPoffer (sender, data) {
    // When receiving a call
    if (this.state === 'RX') {
      this.pc.setRemoteDescription(data).then(
        () => console.log('setRemoteDescription COMPLETE'),
        () => console.log('setRemoteDescription FAILED')
      );

      // And generate an answering offer
      this.pc.createAnswer().then(
        (desc) => {
          // Save local answer
          this.pc.setLocalDescription(desc);
          // And send this to desciption to the remote end
          this.comms.send(this.app, 'ANSWER', sender, desc);
        },
        (err) => console.log(err)
      );
    }
  }
  // 5. Received answer, set remotes answer
  receivedIncomingSDPanswer (sender, data) {
    // When receiving a call
    if (this.state === 'TX') {
      this.pc.setRemoteDescription(data).then(
        () => { /* console.log('setRemoteDescription COMPLETE') */ },
        () => { /* console.log('setRemoteDescription COMPLETE') */ }
      );
    }
  }

  // 6. Called via pc listeners
  receivedCandidate (sender, data) {
    if (this.state !== 'IDLE') {
      const candidate = new RTCIceCandidate(data);
      this.pc.addIceCandidate(candidate)
        .then(
          () => { /* console.log('Found ICE candidates', this.pc)  */ },
          () => { /* console.log("ERROR: Can't Find ICE candidates" */ }
        );
    }
  }
  // Called by both caller and receiver
  endCall () {
    if ((this.state === 'RX' || this.state === 'TX') && this.pc != null) {
      this.pc.close();
      delete this.pc;
      this.state = 'IDLE';
      this.party = null;
      // Call clients cb function (e.g delete a video element)
      this.onEndCall();
    }
  }
  // Function called by client side handler
  hangup () {
    if ((this.state == 'RX' || this.state == 'TX') && this.pc != null) {
      this.comms.send(this.app, 'END_CALL', this.party, '');
      this.endCall();
    }
  }
  // Function called by client side handler
  disconnect (sender, data) {
    if (data === this.party) {
      this.endCall();
    }
  }
}
