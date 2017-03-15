const updateParticipants = (sender, params) => {
  if (params.endpoints.length === 1) {
    addParticipants('mentor', params.username);
  }
  else if (params.endpoints.length === 2) {
    addParticipants('moderator', params.username);
  }
  else {
    addParticipants('students', params.username);
  }
};

const addParticipants = (type, username) => {
  let className = `participants__${type}-list`;
  const newParticipants = document.createElement("li");
  newParticipants.textContent = username;
  newParticipants.classList.add("participants__");
  let list = document.querySelector(`.${className}`);
  list.innerHTML = '';
  list.appendChild(newParticipants);
};
