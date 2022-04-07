import { call, put, takeEvery } from 'redux-saga/effects'
import { getAllWalletKeys, create_monero_wallet, setAllWalletKeys, saveWalletData, open_monero_wallet } from "./moneroWalletUtils"
import { syncWalletSync } from "./syncWalletSyncSaga"
function* workCreateWallet(action) {

    const awk = yield call(getAllWalletKeys)
    yield call(setAllWalletKeys, awk, action.payload.name, action.payload.content) //1.add wallet info to local storage

    const monero_wallet = yield call(create_monero_wallet, action.payload.content) //2.create monero wallet object



    function isObject(objValue) {
        return objValue && typeof objValue === 'object' && objValue.constructor === Object;
    }

    if (isObject(Window.wallets)) {
        Window.wallets[action.payload.name] = monero_wallet
    }
    else {
        Window.wallets = {}
        Window.wallets[action.payload.name] = monero_wallet
    }

    const data = yield call([monero_wallet, "getData"])//3.save wallet data
    yield call(saveWalletData, action.payload.name, data)
    let sh = yield call([monero_wallet, "getSyncHeight"])
    console.log("synchheigt on CREATE daemon connection:", sh)
    yield call([monero_wallet, "setDaemonConnection"], action.payload.content.serverUri) //4. setDaemon Connection
    yield put(syncWalletSync(action.payload.name))
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