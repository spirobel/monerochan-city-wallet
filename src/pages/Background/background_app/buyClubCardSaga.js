import { call, takeLeading, put } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { saveTransaction } from './moneroWalletUtils'
import { saveWallet } from './saveWalletSaga'
import { openPrompt } from './openPromptSaga'

function* workBuyClubCard(action) {
    yield put(openPrompt())
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