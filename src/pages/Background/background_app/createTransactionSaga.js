import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { monerojs } from "./moneroWalletUtils"

function* workCreateTransaction(action) {
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }
    const transaction = yield call([monero_wallet, "createTx"], {
        accountIndex: 0,
        address: action.payload.address,
        amount: new monerojs.BigInteger(action.payload.amount * 1000000000000),
        relay: false
    })

    yield call(() => db.draft_transaction.put({
        fee: monerojs.BigInteger.parse(transaction.getFee()).toString(),
        address: action.payload.address,
        amount: action.payload.amount,
        wallet_name: main_wallet.name,
        metadata: transaction.getMetadata(),
        from_wallet_send_dialog: true,
    }))

}

function* createTransactionSaga() {
    yield takeEvery(CREATE_TRANSACTION, workCreateTransaction)
}


export function createTransaction(wallet_name, address, amount) {
    return {
        type: CREATE_TRANSACTION,
        payload: {
            wallet_name, address, amount
        }
    }
}

export const CREATE_TRANSACTION = 'wallet/createTransaction';

export default createTransactionSaga;