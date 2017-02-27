const appendP = (output, from, message) => {
  output.appendChild(elt('p', from + ' : ' + message));
};

class Chat {
  constructor (comms, input, output, form) {
    this.comms = comms;
    this.input = input;
    this.output = output;
    this.form = form;
    this.app = 'CHAT';
    this.sys = 'SYSTEM';

    comms.send(this.app, 'REGISTER', this.sys, 'JOINED');
    comms.registerHandler(this.app, 'REGISTER', appendP.bind(null, output));
    comms.registerHandler(this.app, 'MESSAGE', appendP.bind(null, output));
    comms.registerHandler(this.app, 'DISCONNECT', appendP.bind(null, output));

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
