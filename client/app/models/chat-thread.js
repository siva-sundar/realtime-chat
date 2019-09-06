import Resource from './resource';

export default Resource.extend({
  resourceProperties: ['from', 'to', 'created_at'],
  resourceIdField: 'id',
  resourceUrl: 'chats',

  init() {
    this._super(...arguments);
    if (!this.id) {
      this.created_at = new Date();
    }
  }
});
