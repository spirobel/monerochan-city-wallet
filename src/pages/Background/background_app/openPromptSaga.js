import { call, takeEvery, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'

function* workOpenPrompt(action) {
    console.log("workOpenprompt")
    chrome.windows
        .create({
            url: `${chrome.runtime.getURL('popup.html')}`,
            type: 'popup',
            width: 400,
            height: 580,
        })
}

function* openPromptSaga() {
    yield takeEvery(OPEN_PROMPT, workOpenPrompt)
}


export function openPrompt() {
    return {
        type: OPEN_PROMPT,
    }
}

export const OPEN_PROMPT = 'wallet/openPrompt';

export default openPromptSaga;