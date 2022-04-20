console.log('This is the background page.');
console.log('Put the background scripts here.');
import doCreateStore from "./background_app/background_store";
//initialize sagas that handle the behavior of the backgroundpage. 
//now we can do: store.dispatch(action)
const store = doCreateStore()
Window.background_store = store;

//forwarding the actions dispatched with dispatchBackground.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action) {
        store.dispatch(message.action)
    }
});