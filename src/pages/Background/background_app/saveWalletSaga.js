import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"

function* workSaveWallet(action) {
    //we assume the wallet is open when we call save on it. 
    const monero_wallet = Window.wallets[action.payload.name]
    const wallet_config = yield call(() => db.wallet_config.where({ name: action.payload.name }).first())
    let mnemonic = wallet_config.mnemonic
    let restoreHeight = wallet_config.restoreHeight
    const data = yield call([monero_wallet, "getData"])
    if (!mnemonic) {
        mnemonic = yield call([monero_wallet, "getMnemonic"])
    }
    if (!restoreHeight) {
        restoreHeight = yield call([monero_wallet, "getSyncHeight"])
    }
    let last_wallet_save_slot = wallet_config.last_wallet_save_slot || "wallet_data2";
    let this_wallet_save_slot = last_wallet_save_slot === "wallet_data1" ? "wallet_data2" : "wallet_data1";

    yield call(() => db[this_wallet_save_slot].put({ name: action.payload.name, data }))
    yield call(() => db.wallet_config.update(action.payload.name, {
        last_wallet_save_slot: this_wallet_save_slot,
        last_saved_time: Date.now(),
        mnemonic,
        restoreHeight
    }))

}

function* saveWalletSaga() {
    yield takeEvery(SAVE_WALLET, workSaveWallet)
}


export function saveWallet(name) {
    return {
        type: SAVE_WALLET,
        payload: {
            name
        }
    }
}

export const SAVE_WALLET = 'wallet/saveWallet';

export default saveWalletSaga;