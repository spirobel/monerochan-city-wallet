export function dispatchBackground(action) {
    let message = {
        action
    }
    chrome.runtime.sendMessage(message);
}