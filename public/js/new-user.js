let users = [];

class NewUser {
  constructor(username){
    this.username = username;
    users.push(username)
  }

  isValid() { //should edit
    if(indexOf(comms.roomid.endpoints[username]) == -1)
    {
      successUsername(this.username);
      showActiveUsers();
    }
    else{
      ErrorUsernameTaken();
    }
  }
