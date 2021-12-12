import React from 'react';
import createSagaMiddleware from '@redux-saga/core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigation-slice'
import devToolsEnhancer from 'remote-redux-devtools';
import { navigate } from '../features/navigation/navigation-slice';
import Navigation from '../features/navigation/Navigation';
import './App.less';
const actionCreators = { navigate }
const saga = createSagaMiddleware();
const store = configureStore({
  reducer: {
    navigation: navigationReducer
  },
  middleware: [saga],
  devTools: false,
  enhancers: [devToolsEnhancer({ actionCreators, trace: true, traceLimit: 25, realtime: true, port: 8000 })],
})

function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
