import { call, put, takeEvery } from 'redux-saga/effects'

function* workCreateWallet(action) {
    //chrome.localstore set action.payload
    //https://developer.chrome.com/docs/extensions/reference/storage/
    yield call(() => chrome.storage.local.set({
        [action.payload.name]: action.payload.content,
        [ACTIVE_WALLET]: [action.payload.name]
    }))
    //TODO turn on active wallet
}

function* createWalletSaga() {
    yield takeEvery(CREATE_WALLET, workCreateWallet)
}


export function saveWallet(name, content) {
    return {
        type: CREATE_WALLET,
        payload: {
            name, content
        }
    }
}

export const CREATE_WALLET = 'wallet/createWallet';
export const ACTIVE_WALLET = 'monerochan/ACTIVE_WALLET';

export default createWalletSaga;