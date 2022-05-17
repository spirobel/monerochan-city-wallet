import React from 'react';
import { Provider } from 'react-redux';
import PopupNavigation from '../features/popup-navigation/PopupNavigation';
import './App.less';
import store from './store';
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action && message.prompt) {
    if (sender.tab?.id) {
      message.action.senderTabId = sender.tab.id;
    }
    store.dispatch(message.action)
  }
});
function PopupApp() {
  return (
    <Provider store={store}>
      <PopupNavigation />
    </Provider>
  );
}

export default PopupApp;
