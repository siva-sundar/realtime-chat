import Component from '@ember/component';

export default Component.extend({
  actions: {
    onSelected(chatThread) {
      let { chats:[chat], id } = chatThread;
      if (chat) {
        this.onSelected(chat);
      } else {
        this.onSelected({
          friendId: id,
        })
      }

      this.onClose();
    },
    onClose() {
      this.onClose();
    }
  }
});
