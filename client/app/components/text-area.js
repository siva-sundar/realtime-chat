import TextArea from "@ember/component/text-area";

const deletionKeys = {
  46: true, // delete
  8: true   // backspace
};
const undoKeys = {
  89: true, // ctrl y (IE 10, IE 11, Edge)
  90: true, // cmd z
  68: true  // ctrl d
};
export default TextArea.extend({
  verticalPadding: null,
  verticalBorderAndMargin: null,
  canResetHeight: false,
  // flag to resize textarea when the value is updated from outside
  isHeightUpdated: false,
  didInsertElement() {
    this._super(...arguments);

    let element = this.element;
    let styles = getComputedStyle(element);
    let minHeight = styles.minHeight;
    minHeight = minHeight === '0px' ? styles.height : minHeight;
    this.verticalPadding = parseInt(styles.paddingTop || 0) + parseInt(styles.paddingBottom || 0);
    this.verticalBorderAndMargin = parseInt(styles.marginTop || 0) + parseInt(styles.marginBottom || 0) + parseInt(styles.borderTopWidth || 0) + parseInt(styles.borderBottomWidth || 0);
    this.minHeight = minHeight;
    this.isContentBoxSizing = styles.boxSizing === 'content-box';
    this.calculateHeight();
  },
  /*
     didRender instead of didUpdateAttrs since value changes are reflected only on didRender
  */
  didRender() {
    this._super(...arguments);

    /*
      Two possible cases
        1. If value is entered by keyboard then the following functions are triggered
            - keydown
            - input
            - calculateHeight
            - didRender

        2. If value is updated from outside
            - didRender
            - calculateHeight

    */

    if (this.isHeightUpdated) {
      /*
        toggling this.isHeightUpdated if its true since height is updated and to avoid calculating the height again.
      */
      this.isHeightUpdated = false;
    } else {
      /*
        canResetHeight = true - it could be a long or short value than the previous  value
      */
      this.canResetHeight = true;
      this.calculateHeight();
    }

  },

  keyDown(event) {
    let whichKey = event.which;
    let element = this.element;
    let contentSelected = element.selectionStart !== element.selectionEnd;
    let controlOrCommandKey = event.metaKey || event.ctrlKey;

    if (whichKey === 13 && !event.shiftKey && event.target.value) {
      this.onSendMessage(event.target.value);
      this.set('value', '');
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
    if (contentSelected || deletionKeys[whichKey] || (controlOrCommandKey && undoKeys[whichKey])) {
      this.canResetHeight = true;
    }
  },

  input() {
    this.calculateHeight();
  },

  calculateHeight() {
    let element = this.element;
    let elementScrollHeight;

    if (this.canResetHeight) {
      element.style.height = this.minHeight;
      this.canResetHeight = false;
    }
    elementScrollHeight = element.scrollHeight;

    if (element.clientHeight < elementScrollHeight) {
      if (this.isContentBoxSizing) {
        elementScrollHeight -= this.verticalPadding;
      } else {
        elementScrollHeight += this.verticalBorderAndMargin;
      }
      element.style.height = `${elementScrollHeight}px`;
    }
    // setting true since the height is updated
    this.isHeightUpdated = true;
  }
});
