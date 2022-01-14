console.log('This is the background page.');
console.log('Put the background scripts here.');
const monerojs = require("monero-javascript");
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



//monero_wallet().then(x => console.log(x))

async function monero_wallet() {
    let wallet = await monerojs.createWalletFull({
        networkType: 'stagenet',
        primaryAddress: "55Py9fSwyEeQX1CydtFfPk96uHEFxSxvD9AYBy7dwnYt9cXqKDjix9rS9AWZ5GnH4B1Z7yHr3B2UH2updNw5ZNJEEnv87H1",
        privateViewKey: "1195868d30373aa9d92c1a21514de97670bcd360c209a409ea3234174892770e",
        password: 'password',
        restoreHeight: 957038,
    });
    await wallet.setDaemonConnection("http://stagenet.xmr-tw.org:38081");
    return wallet
}
