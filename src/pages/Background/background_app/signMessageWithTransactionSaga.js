import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"


function* workSignMessageWithTransaction(action) {
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }
    const tx_proof = yield call([monero_wallet, "getTxProof"], action.payload.tx_hash, action.payload.address, String(action.payload.message))
    yield call(() => db.wallet_config.update(main_wallet.name, {
        tx_proof
    }))

}

function* signMessageWithTransactionSaga() {
    yield takeEvery(SIGN_MESSAGE_WITH_TRANSACTION, workSignMessageWithTransaction)
}


export function signMessageWithTransaction(tx_hash, address, message) {
    return {
        type: SIGN_MESSAGE_WITH_TRANSACTION,
        payload: {
            tx_hash, address, message
        }
    }
}

export const SIGN_MESSAGE_WITH_TRANSACTION = 'wallet/signMessageWithTransaction';

export default signMessageWithTransactionSaga;