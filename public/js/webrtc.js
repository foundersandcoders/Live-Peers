
// WebRTC Module

// Modified To either send stream, receive stream, or both
class WebRTC extends Comms {

  // Takes roomid and endpointid
  constructor (...args) {
    super(...args);
    this.app = 'WEBRTC';
    this._state = 'IDLE';
    // Register Handlers
    this.comms.registerHandler(this.app, 'CALL_REQUEST', this.requestIncomingCall);
    this.comms.registerHandler(this.app, 'REQ_CALL', this.requestIncomingCall);
    this.comms.registerHandler(this.app, 'DENIED', this.callDenied);
    this.comms.registerHandler(this.app, 'CALL_ACCEPT', this.callAccepted);
    this.comms.registerHandler(this.app, 'OFFER', this.receivedIncomingSDPoffer);
    this.comms.registerHandler(this.app, 'SDP_OFFER', this.receivedIncomingSDPoffer);
    this.comms.registerHandler(this.app, 'ANSWER', this.receivedIncomingSDPanswer);
    this.comms.registerHandler(this.app, 'SDP_ANSWER', this.receivedIncomingSDPanswer);
    this.comms.registerHandler(this.app, 'CANDIDATE', this.receivedCandidate);
    this.comms.registerHandler(this.app, 'END_CALL', this.endCall);
    // Placeholder video element
    this.ownvideodump = null;
    this.peervideodump = document.createElement('video');
  }
  // Gets owner media stream (returns a Promise)
  getMediaStream () {
    if (this.localMediaPromise == null) {
      this.localMediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
    }
    return this.localMediaPromise;
  }

  // (For Mentor) Takes DOM video element and add's media stream
  addMyMediaStreamToVideo (video) {
    return this.getMediaStream()
      .then((mediaStream) => {
        // // Add to PC
        // this.pc.addStream(mediaStream);

        // Attach this stream to a video element...
        video.srcObject = mediaStream;

        // See yourself
        video.play();

        // Add stream to ownvideodump
        this.ownvideodump = video;
        // Resolve
        return Promise.resolve(this.pc);
      });
  }

  // Creates Peer Connection instance (called from requestIncomingCall)
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
      this.peervideodump.srcObject = e.stream;
      this.peervideodump.videoTag.play();
    };
  }

  // Get video from peer
  getPeersMediaStream (peerendpointid) {
    // Make a request to peer
    this.comms.send(this.app, 'CALL_REQUEST', peerendpointid, '');
  }

  requestIncomingCall (from) {
  // Only accept a call if we're currently idle
    if (this._state !== 'IDLE') {
      this.send(from, 'DENIED');
    } else {
      this._state = 'RX';
      // Save Endpoint
      this.party = from;
      // Set up peer connection
      this.createPeerConnection(from);
      // Send accept message
      this.send(from, 'CALL_ACCEPT');
    }
  }
  // Alert to say recipient is busy
  callDenied (from) {
    alert("Can't call " + from + ', the line is busy...');
  }
  // Update state to making a call (typically Moderator)
  callAccepted (from) {
    this._state = 'TX';

    // And then give the transmitting stream the ones we have
    this.createPeerConnection(from).then((pc) => {
      // Make offers ONLY if own media stream is active
      const offerOptions = {
        offerToReceiveAudio: this.ownvideodump ? 1 : 0,
        offerToReceiveVideo: this.ownvideodump ? 1 : 0
      };
      // then create offer
      pc.createOffer(
          offerOptions
        ).then((offer) => {
          // Give the offer description to our end of the connector
          pc.setLocalDescription(offer);
          // Send the offer to the remote end of the peer connector
          this.send(this.app, from, 'OFFER', offer);
        },
          // Reject handler
          onCreateSessionDescriptionError
        );
    });
  }
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
          // Set local description
          this.pc.setLocalDescription(desc);
          // And send this to desciption to the remote end
          this.send(this.app, from, 'ANSWER', desc);
        },
        onCreateSessionDescriptionError
      );
    }
  }
  receivedIncomingSDPanswer (from, data) {
    // When receiving a call
    if (this._state === 'TX') {
      this.peerConnector.setRemoteDescription(data).then(
        () => console.log('setRemoteDescription COMPLETE'),
        () => console.log('setRemoteDescription FAILED')
      );
    }
  }

  receivedCandidate (from, data) {
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
// rtc.getPeersMediaStream(theirendpointid)
