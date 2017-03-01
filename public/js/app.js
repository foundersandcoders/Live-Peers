(function(){
  // Elts
  const infoText = document.querySelector('.header__info');
  const popout = document.querySelector('.header__popout');
  const chatBubble = document.querySelector('.nav__chat');
  const videoIcon = document.querySelector('.nav__av');
  const chatWindow = document.querySelector('.apps__chat');

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
  // When VideoIcon is clicked
  videoIcon.addEventListener('click', (e) => {
    videoIcon.classList.add('selected');
    chatBubble.classList.remove('selected');
    chatWindow.classList.remove('selected');
  });

  // Comms Initialise (using global scope variables)
  const myComms = new Comms(myRoomId, myEndpointId);
  // Register initial system callback
  myComms.registerHandler('SYSTEM', 'REGISTER', (sender, params) =>{
    // If success then initialise chat.js module
  });
  // Register CommsID
  myComms.send('SYSTEM', 'REGISTER', '', '');
})();
