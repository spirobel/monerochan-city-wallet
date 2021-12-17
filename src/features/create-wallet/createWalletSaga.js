import { call, put, takeEvery } from 'redux-saga/effects'
import { sendMessage } from '../../utils/sendMessage'

function* workCreateWallet(action) {
    //chrome.localstore set action.payload
    yield call(() => chrome.storage.local.set({
        [action.payload.name]: action.payload.content,

    }))
    //trigger event in background page #https://redux-saga.js.org/docs/basics/ErrorHandling/ 
    //https://redux-saga.js.org/docs/recipes/
    yield call(sendMessage(CREATE_WALLET, { storagekey: action.payload.name }))
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

export default createWalletSaga;