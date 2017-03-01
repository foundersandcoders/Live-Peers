const updatePatricipants = (sender, participants) => {
  participants.forEach((participant) => {
    if(participant.permissions.length == 2){
      if(mentorExist()){
        addParticipant('moderator', participant);
      }
      else{
        addParticipant('mentor', participant);
      }
    }
    else{
      addParticipant('students', participant);
    }
  });
};

const mentorExist = () => {
  return document.querySelector(".online__mentor-list").hasChildNodes();
};

const addParticipant = (type, participant) => {
  let className = createClassName(type);
  const newParticipant = document.createElement("LI");
  newParticipant.textContent = participant.username;
  newParticipant.classList.add("online__user");
  let list = document.querySelector(className);
  list.innerHTML = '';
  list.appendChild(newParticipant);
};

const createClassName = (type) =>{
  const className = ".online__-list";
  const position = 8;
  return [className.slice(0, position), type, className.slice(position)].join('');
};
