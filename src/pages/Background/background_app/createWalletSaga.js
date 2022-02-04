import { call, put, takeEvery } from 'redux-saga/effects'
import { getAllWalletKeys, create_monero_wallet } from "./moneroWalletUtils"

function* workCreateWallet(action) {
    //chrome.localstore set action.payload
    //https://developer.chrome.com/docs/extensions/reference/storage/
    yield call(() => getAllWalletKeys().then((awk) => {
        if (Array.isArray(awk)) {
            awk.push(action.payload.name)
        }
        else {
            awk = [action.payload.name]
        }
        chrome.storage.local.set({
            [action.payload.name]: action.payload.content,
            [ACTIVE_WALLET]: action.payload.name,
            [ALL_WALLET_KEYS]: awk
        })


    }).then(() => {
        let monero_wallet = create_monero_wallet(action.payload.content)
        monero_wallet.then((x) => {
            console.log("data", x.getData())
        })
        if (Array.isArray(Window.wallets)) {
            Window.wallets.push(monero_wallet)
        }
        else {
            Window.wallets = [monero_wallet]
        }

    }))
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
export const ALL_WALLET_KEYS = 'monerochan/ALL_WALLET_KEYS';

export default createWalletSaga;