(function(){
  // Elts
  let AVActive = false;
  const infoText = document.querySelector('.header__info');
  const popout = document.querySelector('.header__popout');
  const chatBubble = document.querySelector('.nav__chat');
  const videoIcon = document.querySelector('.nav__av');
  const chatWindow = document.querySelector('.apps__chat');
  const myVideo = document.querySelector('.av__my-video');
  const errorMessage = document.querySelector('.av__error-message');
  const peerVideo = document.querySelector('.av__peer-video');
  const hangUpButton = document.querySelector('.av__hangup-button');

  // Toggle extra info
  infoText.addEventListener('click', () =>{
    if (popout.style.display === 'none') {
      popout.style = '';
    } else {
      popout.style.display = 'none';
    }
  });

  // When ChatBubble is clicked
  chatBubble.addEventListener('click', (e) => {
    chatBubble.classList.add('selected');
    videoIcon.classList.remove('selected');
    chatWindow.classList.add('selected');
  });

  // Comms Initialise (using global scope variables)
  const myComms = new Comms(myRoomId, myEndpointId);
  // Register initial system callback
  myComms.registerHandler('SYSTEM', 'REGISTER', (sender, params) =>{
    // If success then initialise chat.js module
    const myAV = new AV(myComms);
    myAV.peerVideo = peerVideo;
    myAV.onRTC = () => {
      myVideo.classList.add('shrink');
    };
    myAV.onEndCall = () => {
      console.log('am i here?');
      // myVideo.classList.remove('shrink');
      AVActive = false;
      chatOnly();
    };
    // When VideoIcon is clicked
    videoIcon.addEventListener('click', (e) => {
      videoIcon.classList.add('selected');
      chatBubble.classList.remove('selected');
      chatWindow.classList.remove('selected');
      if (!AVActive) {
        myComms.send('SYSTEM', 'UPDATEPERMISSIONS', '', ['CHAT', 'AV']);
      }
    });
    const chatOnly = () => {
      videoIcon.classList.remove('selected');
      chatBubble.classList.add('selected');
      chatWindow.classList.add('selected');
      myComms.send('SYSTEM', 'UPDATEPERMISSIONS', '', ['CHAT']);
    };
    const clickHangUp = hangUpButton.addEventListener('click', () => {
      myAV.hangUp();
    });
    myComms.registerHandler('SYSTEM', 'UPDATEPERMISSIONS', (sender, endpoints) => {
      if (endpoints.length === 1) {
        myAV.addMyMediaStreamToVideo(myVideo);
        AVActive = true;
      }
      else if (endpoints.length === 2) {
        myAV.addMyMediaStreamToVideo(myVideo);
        endpoints = endpoints.filter((ep) => ep !== myComms.endpointId);
        myAV.callEndpoint(endpoints[0]);
        AVActive = true;
      }
      else {
        errorMessage.style.display = "block";
      }
    });
  });
  // Register CommsID
  myComms.send('SYSTEM', 'REGISTER', '', '');
})();
