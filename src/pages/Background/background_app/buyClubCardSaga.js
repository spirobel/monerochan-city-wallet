import { call, takeLeading, put } from 'redux-saga/effects'
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
            )
    })
    console.log(clubcard)
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