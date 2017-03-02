const updateParticipants = (sender, participants) => {
  participants.forEach((participant) => {
    if(participant.permissions.includes('AV') && participant.permissions.includes('CHAT')){
      if(mentorExist()){
        addParticipant('moderator', participant);
      }
      else{
        addParticipant('mentor', participant);
      }
    }
    else if(participant.permissions.length === 1 && participant.permissions.includes('CHAT')){
      addParticipant('students', participant);
    }
  });
};

const mentorExist = () => {
  return document.querySelector(".online__mentor-list").hasChildNodes();
};

const addParticipant = (type, participant) => {
  let className = `online__${type}-list`;
  const newParticipant = document.createElement("li");
  newParticipant.textContent = participant.username;
  newParticipant.classList.add("online__user");
  let list = document.querySelector(`.${className}`);
  list.innerHTML = '';
  list.appendChild(newParticipant);
};
