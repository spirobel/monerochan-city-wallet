import { call, takeEvery, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveWallet } from "./saveWalletSaga"
function* workCreateAddress(action) {
    const monero_wallet = Window.wallets[action.payload.wallet_name]
    const subaddress = yield call([monero_wallet, "createSubaddress"], 0)

    yield call(() => db.subaddress.put({
        address: subaddress.getAddress(),
        wallet_name: action.payload.wallet_name,
        account_index: subaddress.getAccountIndex(),
        subaddress_index: subaddress.getIndex()
    }))
    put(saveWallet(action.payload.wallet_name))

}

function* createAddressSaga() {
    yield takeEvery(CREATE_ADDRESS, workCreateAddress)
}


export function createAddress(wallet_name) {
    return {
        type: CREATE_ADDRESS,
        payload: {
            wallet_name
        }
    }
}

export const CREATE_ADDRESS = 'wallet/createAddress';

export default createAddressSaga;