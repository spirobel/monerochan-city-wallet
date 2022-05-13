import React from 'react';
import { Provider } from 'react-redux';
import PopupNavigation from '../features/popup-navigation/PopupNavigation';
import './App.less';
import store from './store';

function PopupApp() {
  return (
    <Provider store={store}>
      <PopupNavigation />
    </Provider>
  );
}

export default PopupApp;
