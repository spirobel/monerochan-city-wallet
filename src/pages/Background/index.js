console.log('This is the background page.');
console.log('Put the background scripts here.');
import doCreateStore from "./background_app/background_store";
//initialize sagas that handle the behavior of the backgroundpage. 
const store = doCreateStore()
//now we can do: store.dispatch(action)

//forwarding the actions dispatched with dispatchBackground.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action) {
        store.dispatch(message.action)
    }
});