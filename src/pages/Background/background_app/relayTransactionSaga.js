import { call, takeEvery, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'

function* workRelayTransaction(action) {
    const transaction = yield call(() => db.draft_transaction.where({ wallet_name: action.payload.name }).first())
    const monero_wallet = Window.wallets[action.payload.wallet_name]
    const tx_hash = yield call([monero_wallet, "relayTx"], transaction.metadata)
    put(saveWallet(action.payload.wallet_name))
    yield call(saveTransaction(action.payload.wallet_name, tx_hash))
    yield call(() => db.draft_transaction.delete(action.payload.wallet_name))
}

function* relayTransactionSaga() {
    yield takeEvery(RELAY_TRANSACTION, workRelayTransaction)
}


export function relayTransaction(wallet_name,) {
    return {
        type: RELAY_TRANSACTION,
        payload: {
            wallet_name
        }
    }
}

export const RELAY_TRANSACTION = 'wallet/relayTransaction';

export default relayTransactionSaga;