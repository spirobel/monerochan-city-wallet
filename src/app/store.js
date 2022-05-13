import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from '../features/navigation/navigation-slice'
import popupNavigationReducer from '../features/popup-navigation/popup-navigation-slice';
import devToolsEnhancer from 'remote-redux-devtools';
import { navigate, go_back } from '../features/navigation/navigation-slice';
import { navigate_popup, go_back_popup } from '../features/popup-navigation/popup-navigation-slice';

const doCreateStore = () => {
    //https://stackoverflow.com/questions/37325667/does-es6-module-importing-execute-the-code-inside-the-imported-file
    const actionCreators = { navigate, go_back, navigate_popup, go_back_popup }
    const store = configureStore({
        reducer: {
            navigation: navigationReducer,
            popup_navigation: popupNavigationReducer
        },
        devTools: false,
        enhancers: [devToolsEnhancer({ actionCreators, trace: true, traceLimit: 25, realtime: true, port: 8000 })],
    })
    return store;
};
const store = doCreateStore();


export default store;
