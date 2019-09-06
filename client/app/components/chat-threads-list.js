import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  resourceName: '',

  init () {
    this._super(...arguments);
    this.fetchThreads().then((json) => {
      this.set('chatThreads', json);
    });
  },

  fetchThreads(searchString = '') {
    let { params } = this;

    if (searchString) {
      params.q = searchString;
    }
    return this.get('store').findAll(this.resourceName, {
      params
    });
  },

  actions: {
    showChatHistory(row) {
      if (this.get('onSelected')) {
        this.onSelected(row);
      }
    },

    fetchThreads() {
      return this.fetchThreads(...arguments).then((json) => {
        this.set('chatThreads', json);
      });
    },
  }
});
