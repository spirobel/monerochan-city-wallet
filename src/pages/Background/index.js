console.log('This is the background page.');
console.log('Put the background scripts here.');
const monerojs = require("monero-javascript");
const { CREATE_WALLET } = require("../../features/create-wallet/createWalletSaga");
CREATE_WALLET


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action == CREATE_WALLET) {

        chrome.storage.local.get([message.content.storagekey], function (result) {
            sendResponse({ result })
            console.log('Value currently is ' + result.key, result);
        });
    }

    // return true from the event listener to indicate you wish to send a response asynchronously
    // (this will keep the message channel open to the other end until sendResponse is called).
    //or return a promise: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage
    // example in the link
    return true;
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
