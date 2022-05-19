import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { monerojs } from "./moneroWalletUtils"

function* workCreateClubcardTransaction(action) {
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }

    const clubcard = yield call(() => db.clubcards.where({ url: action.payload.clubcard_url }).first())
    const tx_config = yield call([monero_wallet, "parsePaymentUri"], String(clubcard.payment_uri))
    const amount = Object.assign(new monerojs.BigInteger(), tx_config.state.destinations[0].state.amount).toString()

    const integratedAddress = yield call([monero_wallet, "decodeIntegratedAddress"],
        tx_config.state.destinations[0].state.address)
    console.log("integratedAddress.getStandardAddress()", integratedAddress.getStandardAddress())

    const transaction = yield call([monero_wallet, "createTx"], {
        accountIndex: 0,
        address: integratedAddress.getStandardAddress(),
        // paymentId: integratedAddress.getPaymentId(), drop paymentId for now because this issue needs to be fixed in monero-javascript
        amount,
        relay: false
    })
    console.log("transaction", transaction)
    yield call(() => db.draft_transaction.put({
        fee: monerojs.BigInteger.parse(transaction.getFee()).toString(),
        address: tx_config.state.destinations[0].state.address,
        amount: Object.assign(new monerojs.BigInteger(), tx_config.state.destinations[0].state.amount) / 1000000000000,
        wallet_name: main_wallet.name,
        metadata: transaction.getMetadata(),
        clubcard_url: clubcard.url
    }))

}

function* createClubcardTransactionSaga() {
    yield takeEvery(CREATE_CLUBCARD_TRANSACTION, workCreateClubcardTransaction)
}


export function createClubcardTransaction(clubcard_url) {
    return {
        type: CREATE_CLUBCARD_TRANSACTION,
        payload: {
            clubcard_url
        }
    }
}

export const CREATE_CLUBCARD_TRANSACTION = 'wallet/createClubcardTransaction';

export default createClubcardTransactionSaga;