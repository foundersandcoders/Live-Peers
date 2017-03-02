class Chat {
  constructor (comms, input, output, form) {
    this.comms = comms;
    this.input = input;
    this.output = output;
    this.form = form;
    this.app = 'CHAT';
    this.sys = 'SYSTEM';

    comms.send(this.app, 'REGISTER', this.sys, 'JOINED');
    comms.registerHandler(this.app, 'REGISTER', updateParticipants); //data: object with username and message
    comms.registerHandler(this.app, 'MESSAGE', displayTextMessage);
    comms.registerHandler(this.app, 'DISCONNECT', updateParticipants);

    this.form.onsubmit = (e) => {
      e.preventDefault();
      if (this.input.value) {
        this.comms.send(this.app, 'MESSAGE', this.sys, this.input.value);
        this.input.value = '';
      }
    };

    this.input.onkeydown = (e) => {
      if (e.which === 13 && this.input.value) {
        this.comms.send(this.app, 'MESSAGE', this.sys, this.input.value);
        this.input.value = '';
      }
    };
  }
}
