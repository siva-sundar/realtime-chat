import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),
  actions: {
    updateThread() {
      this.get('store').findAll('chat-thread', {
        params : {
          _embed: 'messages',
          _expand: 'friend'
        }
      }).then((json) => {
        this.set('chatThreads', json);
      });
    },
    addNewThread() {
      this.set('canShowAddNewThreadModal', true);
    },

    onSelected(currentThread) {
      this.set('currentThread', currentThread)
      this.set('canShowAddNewThreadModal', false);
    },

    onClose() {
      this.set('canShowAddNewThreadModal', false);
    }
  }
});
