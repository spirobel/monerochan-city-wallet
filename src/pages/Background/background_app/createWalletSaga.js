import { call, put, takeEvery } from 'redux-saga/effects'
import { getAllWalletKeys, create_monero_wallet, setAllWalletKeys, saveWalletData } from "./moneroWalletUtils"

function* workCreateWallet(action) {

    const awk = yield call(getAllWalletKeys)
    yield call(setAllWalletKeys, awk, action.payload.name, action.payload.content) //1.add wallet info to local storage

    const monero_wallet = yield call(create_monero_wallet, action.payload.content) //2.create monero wallet object

    if (Array.isArray(Window.wallets)) {
        Window.wallets.push(monero_wallet)
    }
    else {
        Window.wallets = [monero_wallet]
    }
    Window.wallets = [...new Set(Window.wallets)] // remove duplicates from live wallets array

    const data = yield call([monero_wallet, getData])//3.save wallet data
    yield call(saveWalletData, action.payload.name, data)

    yield call([monero_wallet, setDaemonConnection], action.payload.serverUri) //4. setDaemon Connection

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