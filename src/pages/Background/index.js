console.log('This is the background page.');
console.log('Put the background scripts here.');
import doCreateStore from "./background_app/background_store";
import { db } from '../../utils/dexie_db'
import { syncWalletSync } from "./background_app/syncWalletSyncSaga";
import { setPromptTabId } from "./background_app/promptSlice";
//initialize sagas that handle the behavior of the backgroundpage. 
//now we can do: store.dispatch(action)
const store = doCreateStore()
Window.background_store = store;
db.wallet_config.toArray().then(wallets => wallets.forEach(wallet => store.dispatch(syncWalletSync(wallet.name))));

//forwarding the actions dispatched with dispatchBackground.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action && !message.prompt) {
        if (sender.tab?.id) {
            message.action.senderTabId = sender.tab.id;
        }
        store.dispatch(message.action)
    }
});


const onRemovedListener = (tid) => {
    const promptID = store.getState().prompt.tabId

    if (promptID === tid) {
        store.dispatch(setPromptTabId(null))
        console.log("PROMPT CLOSED, prompt tabid:")
    }
};
chrome.tabs.onRemoved.addListener(onRemovedListener);