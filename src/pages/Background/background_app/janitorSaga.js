//the duties of this saga are:
//1.turnoff currently inactive wallets
//2.turnon currently active wallet  - > done
//3.save cache and keys
import { delay, call, put, takeEvery } from 'redux-saga/effects'
import { create_monero_wallet, getCurrentActiveWallet } from "./moneroWalletUtils"


function* janitorSaga() {
    while (true) {
        yield delay(30000)
        yield call(() => {
            getCurrentActiveWallet().then((aw) => {
                create_monero_wallet(aw)
            })
        })
    }
}

export const ACTIVE_WALLET = 'monerochan/ACTIVE_WALLET';

export default janitorSaga;