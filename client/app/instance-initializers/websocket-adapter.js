export function initialize(appInstance) {
  appInstance.lookup('service:websocket-adapter').initialize();
}

export default {
  initialize
};
