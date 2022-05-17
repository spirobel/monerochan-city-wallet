export function dispatchPrompt(action) {
    let message = {
        action, prompt: true,
    }
    chrome.runtime.sendMessage(message);
}