class WebRTC {
  // Takes comms object initially
  constructor (comms) {
    this.comms = comms;
    this.app = 'WEBRTC';
    this._state = 'IDLE';
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

    // For peer video output
    this.peervideo;
  }
  // Gets owner media stream (returns a Promise)
  getMediaStream () {
    // change audio to TRUE for production
    if (this.localMediaPromise == null) {
      this.localMediaPromise = navigator.mediaDevices.getUserMedia(
        {video: {width: 300, height: 160}, audio: false});
    }
    return this.localMediaPromise;
  }

  // (For Mentor) Takes DOM video element and add's media stream
  addMyMediaStreamToVideo (video) {
    return this.getMediaStream()
      .then((mediaStream) => {
        // // Add to PC

        // Attach this stream to a video element...
        video.srcObject = mediaStream;
        // When meta data loaded, play
        video.onloadedmetadata = (e) => {
          video.play();
        };
        return;
      });
  }

  // Creates Peer Connection instance
  createPeerConnection (from) {
    // Define initial peer connection object
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
    };
    // Add stream for own stream
    var prom = this.getMediaStream();

    prom.then((stream) => this.pc.addStream(stream));

    // Return PC
    return prom;
  }

  // 1. Get video from peer (called by client)
  getPeersMediaStream (peerendpointid) {
    // Make a request to peer
    this.comms.send(this.app, 'CALL_REQUEST', peerendpointid, '');
  }

  requestIncomingCall (from) {
  // 2. Only accept a call if we're currently idle (moderator)
    if (this._state !== 'IDLE') {
      this.comms.send(this.app, 'DENIED', from, '');
    } else {
      // Change state to receiving call
      this._state = 'RX';
      // Set up peer connection
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

  // 3. Mentor
  callAccepted (from) {
    // Change state to in call
    this._state = 'TX';
    // Make this.pc available
    this.createPeerConnection(from).then(() => {
      // Make offers ONLY if own media stream is active
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
            // Reject handler
            onCreateSessionDescriptionError
        );
    });
  }
  // 4. Save offer from other endpoint (moderators window)
  receivedIncomingSDPoffer (from, data) {
    // When receiving a call
    if (this._state === 'RX') {
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
  // 5. Received answer
  receivedIncomingSDPanswer (from, data) {
    console.log('receivedIncomingSDPanswer');
    // When receiving a call
    if (this._state === 'TX') {
      this.pc.setRemoteDescription(data).then(
        () => console.log('setRemoteDescription COMPLETE'),
        () => console.log('setRemoteDescription FAILED')
      );
    }
  }

  receivedCandidate (from, data) {
    console.log('receivedCandidate');
    if (this._state !== 'IDLE') {
      const candidate = new RTCIceCandidate(data);
      this.pc.addIceCandidate(candidate)
        .then(() => {
          console.log('Found ICE candidates', this.pc);
        },
          (err) => {
            console.log("ERROR: Can't Find ICE candidates", err, this.pc);
          }
        );
    }
  }
  endCall (from, params) {
    // Need server to send message on disconnect
  }

}

const onCreateSessionDescriptionError = (error) => {
  console.log(error.toString());
};

/* Usage */

// Mentor

// const rtc = new WebRTC(roomid, endpointid)
// rtc.addMyMediaStreamToVideo(document.querySelector(".videoelt"))

// Student

// const rtc = new WebRTC(roomid, endpointid)
// rtc.addMyMediaStreamToVideo(document.querySelector(".videoelt"))
