import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '../features/navigation/navigation-slice'
import devToolsEnhancer from 'remote-redux-devtools';
import { navigate, go_back } from '../features/navigation/navigation-slice';

const doCreateStore = () => {
    //https://stackoverflow.com/questions/37325667/does-es6-module-importing-execute-the-code-inside-the-imported-file
    const actionCreators = { navigate, go_back }
    const store = configureStore({
        reducer: {
            navigation: navigationReducer
        },
        devTools: false,
        enhancers: [devToolsEnhancer({ actionCreators, trace: true, traceLimit: 25, realtime: true, port: 8000 })],
    })
    return store;
};
const store = doCreateStore();


export default store;
