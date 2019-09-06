import Service, { inject as service } from '@ember/service';
import Evented from '@ember/object/evented';

export default Service.extend(Evented, {
  currentUser: service(),

  initialize() {
    let connection = new WebSocket('ws://localhost:8080');

    connection.onopen = () => {
      this.dispatchMessage({
        type: 'log',
        message: 'connection established',
      });
    };

    this.connection = connection;

    this.registerOnMessageReceived();
  },


  registerOnMessageReceived() {
    this.connection.onmessage = ({ data }) => {
      data = JSON.parse(data);
      this.trigger('onMessageReceived', data);
    }
  },

  dispatchMessage(data = {}) {
    this.connection.send(JSON.stringify(data));
  }
});
