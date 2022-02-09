import { call, put, takeEvery } from 'redux-saga/effects'
import { getAllWalletKeys, create_monero_wallet, setAllWalletKeys } from "./moneroWalletUtils"

function* workCreateWallet(action) {
    //chrome.localstore set action.payload
    //https://developer.chrome.com/docs/extensions/reference/storage/
    const awk = yield call(getAllWalletKeys)
    console.log("that awk", awk)
    yield call(setAllWalletKeys, [awk, action.payload.name, action.payload.content])
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