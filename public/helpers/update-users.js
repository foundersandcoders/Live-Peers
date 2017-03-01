const updateUsers = (sender, users) => {
  users.forEach((user) => {
    if(user.permissions.length == 2){
      if(mentorExist()){
        addUser('moderator', user);
      }
      else{
        addUser('mentor', user);
      }
    }
    else{
      addUser('students', user);
    }
  });
};

const mentorExist = () => {
  return document.querySelector(".online__mentor-list").hasChildNodes();
};

const addUser = (type, user) => {
  let className = createClassName(type);
  const newUser = document.createElement("LI");
  newUser.innerHTML = user.username;
  newUser.classList.add("online__user");
  let list = document.querySelector(className);
  list.appendChild(newUser);
};

const createClassName = (type) =>{
  let className = ".class__-list";
  var position = 8;
  return [className.slice(0, position), type, className.slice(position)].join('');
};
