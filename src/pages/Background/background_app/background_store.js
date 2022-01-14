import { configureStore } from '@reduxjs/toolkit'
import devToolsEnhancer from 'remote-redux-devtools';
import createSagaMiddleware from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects'
import createWalletSaga from './createWalletSaga';
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
const doCreateStore = () => {
    //https://stackoverflow.com/questions/37325667/does-es6-module-importing-execute-the-code-inside-the-imported-file
    const actionCreators = { navigate }
    const saga = createSagaMiddleware();
    const store = configureStore({
        reducer: {
        },
        middleware: [saga],
        devTools: false,
        enhancers: [devToolsEnhancer({ actionCreators, trace: true, traceLimit: 25, realtime: true, port: 8001 })],
    })
    saga.run(rootSaga)
    return store;
};

export default doCreateStore();