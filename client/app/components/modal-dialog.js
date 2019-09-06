import Component from '@ember/component';

export default Component.extend({
  classNames: ['modal fade'],
  didInsertElement() {
    this._super(...arguments);
    this.element.classList.remove('fade');
  }
});
