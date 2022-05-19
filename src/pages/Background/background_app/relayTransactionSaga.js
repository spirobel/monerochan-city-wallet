import { call, takeEvery, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'

function* workRelayTransaction(action) {
    const transaction = yield call(() => db.draft_transaction.where({ id: action.payload.draft_transaction_id }).first())
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }
    const tx_hash = yield call([monero_wallet, "relayTx"], transaction.metadata)
    yield put(saveWallet(main_wallet.name))
    yield call(saveTransaction, main_wallet.name, tx_hash)
    yield call(() => db.draft_transaction.delete(action.payload.draft_transaction_id))
}

function* relayTransactionSaga() {
    yield takeEvery(RELAY_TRANSACTION, workRelayTransaction)
}


export function relayTransaction(draft_transaction_id) {
    return {
        type: RELAY_TRANSACTION,
        payload: {
            draft_transaction_id
        }
    }
}

export const RELAY_TRANSACTION = 'wallet/relayTransaction';

export default relayTransactionSaga;