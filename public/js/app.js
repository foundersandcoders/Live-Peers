(function(){
  // Elts
  const infoText = document.querySelector('.header__info');
  const popout = document.querySelector('.header__popout');
  const chatBubble = document.querySelector('.nav__chat');
  const videoIcon = document.querySelector('.nav__av');
  const chatWindow = document.querySelector('.apps__chat');

  const messagesTab = document.querySelector('.messages-tab');
  const onlineTab = document.querySelector('.online-tab');
  const messagesWindow = document.querySelector('.chat');
  const onlineWindow = document.querySelector('.online');

  //Chat Components
  const chatInput = document.querySelector('.chat__input');
  const chatOutput = document.querySelector('.chat__messages');
  const chatForm = document.querySelector('.chat__form');

  messagesTab.addEventListener('click', () =>{
    messagesTab.classList.add('visible');
    messagesWindow.style.display = "block";
    onlineTab.classList.remove('visible');
    onlineWindow.style.display = "none";
  });

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
    const myChat = new Chat(myComms, chatInput, chatOutput, chatForm);
  });
  // Register CommsID
  myComms.send('SYSTEM', 'REGISTER', '', '');
})();
