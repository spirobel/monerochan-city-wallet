import { call, takeLeading, put, select } from 'redux-saga/effects'
import { setPromptTabId } from './promptSlice'
function openPopup() {
    return new Promise((resolve) => {
        chrome.windows
            .create({
                url: `${chrome.runtime.getURL('popup.html')}`,
                type: 'popup',
                width: 400,
                height: 580
            },
                window => {
                    resolve(window.tabs[0].id)
                }
            )
    })
}
function getPopup(tabId) {
    if (!tabId) { return null; }
    return new Promise((resolve) => { chrome.tabs.get(tabId, (tab) => resolve(tab)) });
}
function makeSureTabisActive(windowId) {
    return new Promise((resolve) => { chrome.windows.update(windowId, { 'focused': true }, (window) => { resolve(window) }) });

}

function* workOpenPrompt(action) {
    let tabId = yield select(state => state.prompt.tabId)
    const opentab = yield call(getPopup, tabId)
    if (!opentab) {
        tabId = yield call(openPopup)
        yield put(setPromptTabId(tabId))
    } else {
        yield call(makeSureTabisActive, opentab.windowId)
    }
}

function* openPromptSaga() {
    yield takeLeading(OPEN_PROMPT, workOpenPrompt)
}


export function openPrompt() {
    return {
        type: OPEN_PROMPT,
    }
}

export const OPEN_PROMPT = 'wallet/openPrompt';

export default openPromptSaga;