import { message } from "antd";
import { CREATE_WALLET } from "../features/create-wallet/createWalletSaga";

/**
 * Promise wrapper for chrome.runtime.sendMessage
 * @param action name of the action (the background_script is working like a redux saga)
 * @param content of the message to be sent to the background script
 * @returns {Promise<any>}
 * docs: https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
 * https://stackoverflow.com/questions/52087734/make-promise-wait-for-a-chrome-runtime-sendmessage/52089844
 */
export function sendMessage(action, content) {
    let message = {
        action, content
    }
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
            if (response.error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}
// waiting for tasks from background
https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
/**
 * Promise wrapper for chrome.runtime.onMessage
 * @param message
 * @param error
 * @returns {Promise<any>}
 * docs: https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage
 * https://stackoverflow.com/questions/52087734/make-promise-wait-for-a-chrome-runtime-sendmessage/52089844
 */
function EXAMPLEreceiveMessage() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action == CREATE_WALLET) {

            chrome.storage.local.get([message.content.storagekey], function (result) {
                sendResponse({ result })
                console.log('Value currently is ' + result.key, result);
            });
        }

        // Asynchronously process your "item", but DON'T return the promise
        asyncOperation().then(() => {
            // telling that CS has finished its job
            sendResponse({ complete: true });
        }).catch((error) => {
            sendResponse({ error: "this is an error" });
        });

        // return true from the event listener to indicate you wish to send a response asynchronously
        // (this will keep the message channel open to the other end until sendResponse is called).
        //or return a promise: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage
        // example in the link
        return true;
    });
}
