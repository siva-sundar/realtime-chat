import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { schedule } from '@ember/runloop';

export default Component.extend({
  websocketAdapter: service('websocket-adapter'),
  store: service(),
  messages: null,

  init() {
    this._super(...arguments);

    if (this.currentThread.id) {
      this.fetchMessages(this.currentThread.id)
    } else {
      this.set('currentThread.messages', []);
    }

    this.get('websocketAdapter').on('onMessageReceived', ({ message, is_new_thread, id } ) => {
      if (is_new_thread) {
        this.set('currentThread.id', id);
        this.updateThread();
      }
      this.get('currentThread.messages').pushObject({
        text: message,
        is_received: true
      });
      this.updateScrollPosition();
    });
  },


  fetchMessages(id) {
    return this.get('store').getJSON(`chats/${id}`, { _embed: 'messages', _expand: 'friend' }).then((json) => {
      this._currentThread = json;
      this.set('currentThread', json);
      this.updateScrollPosition();
    });
  },

  didUpdateAttrs() {
    if (this._currentThread !== this.currentThread) {
      if (this.currentThread.id) {
        this.fetchMessages(this.currentThread.id)
      } else {
        this.set('currentThread.messages', []);
      }
      this.set('value', '')
      this._currentThread = this.currentThread;
    }
  },


  updateScrollPosition() {
    schedule('afterRender', () => {
      let listElement = this.element.querySelector('.chat-messages');
      listElement.scrollTop = listElement.scrollHeight;
    });
  },

  actions: {
    onSendMessage(selectedItem, message) {

      let hash;

      if (selectedItem.id) {
        hash = {
          type: 'message',
          url: `http://localhost:3000/chats/${selectedItem.id}/messages`,
          message,
          action: 'add_new_message'
        }
      } else {
        hash = {
          action: 'add_new_thread',
          url : 'http://localhost:3000/chats/',
          message,
          friendId: selectedItem.friendId
        }
      }

      this.get('websocketAdapter').dispatchMessage(hash);
      this.get('currentThread.messages').pushObject({
        text: message
      });
    }
  }
});
