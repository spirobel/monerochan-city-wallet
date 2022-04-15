import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"

function* workSaveTransaction(action) {
    let transaction = yield call(() => db.transactions.where({ wallet_name: action.payload.wallet_name }).first())
    if (transaction) {
        yield call(() => db.transactions.update([action.payload.wallet_name, action.payload.tx_hash], action.payload.data))
    } else {
        yield call(() => db.transactions.add({
            wallet_name: action.payload.wallet_name,
            tx_hash: action.payload.tx_hash,
            ...action.payload.data
        }))
    }

}

function* saveTransactionSaga() {
    yield takeEvery(SAVE_TRANSACTION, workSaveTransaction)
}


export function saveTransaction(wallet_name, tx_hash, data) {
    return {
        type: SAVE_TRANSACTION,
        payload: {
            wallet_name, tx_hash, data
        }
    }
}

export const SAVE_TRANSACTION = 'wallet/saveTransaction';

export default saveTransactionSaga;