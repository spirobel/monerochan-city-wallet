import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '../features/navigation/navigation-slice'
import devToolsEnhancer from 'remote-redux-devtools';
import { navigate } from '../features/navigation/navigation-slice';
import createSagaMiddleware from '@redux-saga/core';
import { all, call, spawn } from 'redux-saga/effects'
import createWalletSaga from '../features/create-wallet/createWalletSaga'
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
    let preloadedState = {}
    if (module.hot) {
        module.hot.dispose((data) => {
            // Clean up and pass data to the updated module...
            data = store.getState();
        });
        preloadedState = module.hot.data;
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
        preloadedState,
        enhancers: [devToolsEnhancer({ actionCreators, trace: true, traceLimit: 25, realtime: true, port: 8000 })],
    })
    saga.run(rootSaga)
    console.log(window.initialState)


    return store;
};
const store = doCreateStore();


export default store;
