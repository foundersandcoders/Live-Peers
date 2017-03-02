const updateParticipants = (sender, participants) => {
  participants.forEach((participants) => {
    if(participants.permissions.includes('AV') && participants.permissions.includes('CHAT')){
      if(mentorExist()){
        addParticipants('moderator', participants);
      }
      else{
        addParticipants('mentor', participants);
      }
    }
    else if(participants.permissions.length === 1 && participants.permissions.includes('CHAT')){
      addParticipants('students', participants);
    }
  });
};

const mentorExist = () => {
  return document.querySelector(".online__mentor-list").hasChildNodes();
};

const addParticipants = (type, participants) => {
  let className = `participants__${type}-list`;
  const newParticipants = document.createElement("li");
  newParticipants.textContent = participants.username;
  newParticipants.classList.add("participants__");
  let list = document.querySelector(`.${className}`);
  list.innerHTML = '';
  list.appendChild(newParticipants);
};
