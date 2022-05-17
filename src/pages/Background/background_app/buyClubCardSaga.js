import { call, takeLeading, put, delay } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'
import { openPrompt } from './openPromptSaga'

function* workBuyClubCard(action) {
    yield put(openPrompt())
    const clubcard = yield call(() => {
        return fetch(action.payload.url + '/buy')
            .then(response =>
                response.json().then(json => ({ json, response }))
            ).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json
            })
    })
    console.log(clubcard)
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }
    console.log(main_wallet, monero_wallet)
    const tx_config = yield call([monero_wallet, "parsePaymentUri"], String(clubcard.payment_uri))
    console.log(tx_config)

}

function* buyClubCardSaga() {
    yield takeLeading(BUY_CLUBCARD, workBuyClubCard)
}


export function buyClubcard(url) {
    return {
        type: BUY_CLUBCARD,
        payload: {
            url
        }
    }
}

export const BUY_CLUBCARD = 'wallet/buyClubcard';

export default buyClubCardSaga;