import { call, takeEvery, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'

function* workRelayClubcardTransaction(action) {
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }

    const clubcard = yield call(() => db.clubcards.where({ url: action.payload.clubcard_url }).first())
    const transaction = yield call(() => db.draft_transaction.where({ wallet_name: main_wallet.name, clubcard_url: action.payload.clubcard_url }).first())

    const tx_hash = yield call([monero_wallet, "relayTx"], transaction.metadata)
    yield put(saveWallet(main_wallet.name))
    yield call(saveTransaction, main_wallet.name, tx_hash)
    yield call(() => db.draft_transaction.delete(transaction.id))
    yield call(() => db.clubcards.update(clubcard.id, { tx_hash }))

}

function* relayClubcardTransactionSaga() {
    yield takeEvery(RELAY_CLUBCARD_TRANSACTION, workRelayClubcardTransaction)
}


export function relayClubcardTransaction(clubcard_url) {
    return {
        type: RELAY_CLUBCARD_TRANSACTION,
        payload: {
            clubcard_url
        }
    }
}

export const RELAY_CLUBCARD_TRANSACTION = 'wallet/relayClubcardTransaction';

export default relayClubcardTransactionSaga;