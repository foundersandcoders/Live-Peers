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

  const messagesTab = document.querySelector('.messages-tab');
  const onlineTab = document.querySelector('.online-tab');
  const messagesWindow = document.querySelector('.chat');
  const onlineWindow = document.querySelector('.online');

  // Chat Components
  const chatInput = document.querySelector('.chat__input');
  const chatOutput = document.querySelector('.chat__messages');
  const chatForm = document.querySelector('.chat__form');

  // Message Tab Toggle
  messagesTab.addEventListener('click', () =>{
    messagesTab.classList.add('visible');
    messagesWindow.style.display = "block";
    onlineTab.classList.remove('visible');
    onlineWindow.style.display = "none";
  });

  // Online Tab Toggle
  onlineTab.addEventListener('click', () =>{
    onlineTab.classList.add('visible');
    onlineWindow.style.display = "block";
    messagesTab.classList.remove('visible');
    messagesWindow.style.display = "none";
  });

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
  // Register handler after endpoint has registered its comms ID
  myComms.registerHandler('SYSTEM', 'REGISTER', (sender, params) =>{
    // Initialise cat & AV Modules
    const myChat = new Chat(myComms, chatInput, chatOutput, chatForm);
    const myAV = new AV(myComms);
    myAV.peerVideo = peerVideo;
    myAV.onRTC = () => {
      myVideo.classList.add('shrink');
    };
    myAV.onEndCall = () => {
      AVActive = false;
      chatOnly();
    };
    // Toggles video icon, shrinks chat window
    // enables video & updates permissions
    // (if AV not active)
    videoIcon.addEventListener('click', (e) => {
      videoIcon.classList.add('selected');
      chatBubble.classList.remove('selected');
      chatWindow.classList.remove('selected');
      myComms.send('SYSTEM', 'UPDATEPERMISSIONS', '', ['CHAT', 'AV']);
    });
    // Toggles chat icon, sets chat window to full view
    // enables only chat permissions
    const chatOnly = () => {
      videoIcon.classList.remove('selected');
      chatBubble.classList.add('selected');
      chatWindow.classList.add('selected');
      myVideo.classList.remove('shrink');
      AVActive = false;
      myComms.send('SYSTEM', 'UPDATEPERMISSIONS', '', ['CHAT']);
    };
    // Calls the AV modules hang up method
    hangUpButton.addEventListener('click', () => {
      myAV.hangUp();
    });
    // After permissions updated to 'av'
    myComms.registerHandler('SYSTEM', 'UPDATEPERMISSIONS', (sender, endpoints) => {
      let totalEps = endpoints.length;
      if (totalEps === 1 || totalEps === 2) {
        myAV.addMyMediaStreamToVideo(myVideo);
        AVActive = true;
        if (totalEps === 2) {
          endpoints = endpoints.filter((ep) => ep !== myComms.endpointId);
          myAV.callEndpoint(endpoints[0]);
        }
      }
      else {
        errorMessage.style.display = "block";
      }
    });
  });
  // Register CommsID
  myComms.send('SYSTEM', 'REGISTER', '', '');
})();
