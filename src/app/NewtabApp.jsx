import React from 'react';
import { Provider } from 'react-redux';
import classNames from 'classnames';

import Navigation from '../features/navigation/Navigation';
import { Clubcards } from '../features/clubcards/Clubcards';
import './App.less';
import store from './store';

function NewtabApp() {
  return (
    <Provider store={store}>
      <div style={{
        paddingTop: "50vh",
        paddingLeft: "50vh",
        marginTop: "-194px"
      }}>
        <Clubcards />

      </div>
    </Provider>
  );
}

export default NewtabApp;
