import React from 'react';
import createSagaMiddleware from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigation-slice'
import devToolsEnhancer from 'remote-redux-devtools';
import { navigate } from '../features/navigation/navigation-slice';
import Navigation from '../features/navigation/Navigation';
import createWalletSaga from '../features/create-wallet/createWalletSaga'
import './App.less';

//https://redux-saga.js.org/docs/advanced/RootSaga/
function* rootSaga() {
  const sagas = [
    createWalletSaga,

  ];

  yield all(sagas.map(saga =>
    spawn(function* () {
      while (true) {
        try {
          yield call(saga)
          //  break
        } catch (e) {
          console.log(e)
        }
      }
    }))
  );
}




//https://stackoverflow.com/questions/37325667/does-es6-module-importing-execute-the-code-inside-the-imported-file
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
saga.run(rootSaga)


function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
