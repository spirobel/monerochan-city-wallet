import { configureStore } from '@reduxjs/toolkit'
import devToolsEnhancer from 'remote-redux-devtools';
import createSagaMiddleware from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects'
import startupSaga from './startupSaga';
import syncWalletSyncSaga from './syncWalletSyncSaga';
import saveWalletSaga from './saveWalletSaga';
import saveTransactionSaga from './saveTransactionSaga';
import createAddressSaga from './createAddressSaga';
//https://redux-saga.js.org/docs/advanced/RootSaga/
function* rootSaga() {
    const sagas = [
        createAddressSaga,
        saveTransactionSaga,
        saveWalletSaga,
        syncWalletSyncSaga,
        startupSaga
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
const store = doCreateStore();


export default store;