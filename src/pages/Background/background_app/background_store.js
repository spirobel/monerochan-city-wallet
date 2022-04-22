import { configureStore } from '@reduxjs/toolkit'
import devToolsEnhancer from 'remote-redux-devtools';
import createSagaMiddleware from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects'
import saveWalletSaga from './saveWalletSaga';
import syncWalletSyncSaga from './syncWalletSyncSaga';
import createAddressSaga from './createAddressSaga';
import createTransactionSaga from './createTransactionSaga';
import relayTransactionSaga from './relayTransactionSaga';
//https://redux-saga.js.org/docs/advanced/RootSaga/
function* rootSaga() {
    const sagas = [
        relayTransactionSaga,
        createTransactionSaga,
        createAddressSaga,
        saveWalletSaga,
        syncWalletSyncSaga
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
    const saga = createSagaMiddleware();
    const store = configureStore({
        reducer: {
            default: state => {
                return null;
            },
        },
        middleware: [saga],
        devTools: false,
        enhancers: [devToolsEnhancer({ trace: true, traceLimit: 25, realtime: true, port: 8001 })],
    })
    saga.run(rootSaga)
    return store;
};



export default doCreateStore;