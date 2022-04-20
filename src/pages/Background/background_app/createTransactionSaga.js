import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"

function* workCreateTransaction(action) {
    const monero_wallet = Window.wallets[action.payload.wallet_name]
    const transaction = yield call([monero_wallet, "createTx"], {
        accountIndex: 0,
        address: action.payload.address,
        amount: new BigInteger(action.payload.amount * 1000000000000),
        relay: false
    })

    yield call(() => db.draft_transaction.put({
        fee: transaction.getFee(),
        address: action.payload.address,
        amount: action.payload.amount,
        wallet_name: action.payload.wallet_name,
        metadata: transaction.getMetadata()
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