/* WebRTC Class (uses comms module) */

/* Usage
// 1. call new WebRTC(commsmodule)
// 2. call addMyMediaStreamToVideo(videoDOMelement)
// 3. call getPeersMediaStream(PeerEndpointID)
*/

class WebRTC {
  // Takes comms object initially
  constructor (comms) {
    this.comms = comms;
    this.app = 'WEBRTC';
    this.state = 'IDLE';
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

    // Callback register after complete
    this.onRTC = (func) =>

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
  createPeerConnection (from) {
    this.pc = new RTCPeerConnection();
    // Add Ice Candidate Listener
    this.pc.onicecandidate = (e) => {
      if (e.candidate != null) {
        this.comms.send(this.app, 'CANDIDATE', from, e.candidate);
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

  // 1. Get video from peer
  callEndpoint (peerendpointid) {
    // Make a request to peer
    this.comms.send(this.app, 'CALL_REQUEST', peerendpointid, '');
  }

  // 2. Only accept a call if we're currently idle
  requestIncomingCall (from) {
    if (this.state !== 'IDLE') {
      this.comms.send(this.app, 'DENIED', from, '');
    } else {
      // Change call state to receiving
      this.state = 'RX';
      // Set up pc, (prepare own media stream) then send accept message
      this.createPeerConnection(from).then(() => {
        this.comms.send(this.app, 'CALL_ACCEPT', from, '');
      });
      // Send accept message
    }
  }
  // Alert to say recipient is busy
  callDenied (from) {
    alert("Can't call " + from + ', the line is busy...');
  }

  // 3. Caller is notified the receiver has accepted the call
  callAccepted (from) {
    // Change state to in call
    this.state = 'TX';
    // Create peer connection
    this.createPeerConnection(from).then(() => {
      // Make offers
      const offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
      };
      // then create offer from new PC
      this.pc.createOffer(
            offerOptions
          ).then((offer) => {
            // Save the offer description
            this.pc.setLocalDescription(offer);
            // Send the offer
            this.comms.send(this.app, 'OFFER', from, offer);
          },
            // ... or reject handler
            onCreateSessionDescriptionError
        );
    });
  }
  // 4. Save offer from other endpoint (moderators window)
  receivedIncomingSDPoffer (from, data) {
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
          this.comms.send(this.app, 'ANSWER', from, desc);
        },
        onCreateSessionDescriptionError
      );
    }
  }
  // 5. Received answer, set remotes answer
  receivedIncomingSDPanswer (from, data) {
    // When receiving a call
    if (this.state === 'TX') {
      this.pc.setRemoteDescription(data).then(
        () => { /* console.log('setRemoteDescription COMPLETE') */ },
        () => { /* console.log('setRemoteDescription COMPLETE') */ }
      );
    }
  }

  // 6. Called from pc listeners
  receivedCandidate (from, data) {
    if (this.state !== 'IDLE') {
      const candidate = new RTCIceCandidate(data);
      this.pc.addIceCandidate(candidate)
        .then(
          () => { /* console.log('Found ICE candidates', this.pc)  */ },
          () => { /* console.log("ERROR: Can't Find ICE candidates" */ }
        );
    }
  }
  endCall (from, params) {
    // TODO: when a socket disconnects, method to remove remote peer connection
  }

}

const onCreateSessionDescriptionError = () => {
  /* console.log(error.toString()); */
};
