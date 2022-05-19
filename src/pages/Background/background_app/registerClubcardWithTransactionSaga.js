import { call, takeEvery } from 'redux-saga/effects'
import { db } from "../../../utils/dexie_db"
import { dispatchPrompt } from '../../../utils/dispatchPrompt'
import { navigate_popup } from '../../../features/popup-navigation/popup-navigation-slice'


function* workRegisterClubcardWithTransaction(action) {
    let main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
    let monero_wallet = Window.wallets[main_wallet.name]
    while (!monero_wallet) {
        delay(300)
        main_wallet = yield call(() => db.wallet_config.orderBy('main_wallet').last())
        monero_wallet = Window.wallets[main_wallet.name]
    }
    let clubcard = yield call(() => db.clubcards.where({ url: action.payload.clubcard_url }).first())
    if (!clubcard) {
        clubcard = yield call(() => {
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
        clubcard.tx_hash = action.payload.tx_hash
        clubcard.address = action.payload.address
        clubcard.url = action.payload.clubcard_url
        yield call(() => db.clubcards.put(clubcard))
    }

    const register_message = yield call(() => {
        return fetch(action.payload.clubcard_url + '/register')
            .then(response =>
                response.json().then(json => ({ json, response }))
            ).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json.register_message
            })
    })
    const tx_proof = yield call([monero_wallet, "getTxProof"], action.payload.tx_hash, action.payload.address, String(register_message))
    const registration_worked = yield call(() => {
        return fetch(action.payload.clubcard_url + '/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ txHash: action.payload.tx_hash, signature: tx_proof })
        })
            .then(response =>
                response.json().then(json => ({ json, response }))
            ).then(({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                return json.success
            })
    })
    if (registration_worked) {
        yield call(() => db.clubcards.update(clubcard.id, { bought: 1 }))
        dispatchPrompt(navigate_popup({ destination: "boughtClubcardSuccess", clubcard }))
    }
}

function* registerClubcardWithTransactionSaga() {
    yield takeEvery(REGISTER_CLUBCARD_WITH_TRANSACTION, workRegisterClubcardWithTransaction)
}


export function registerClubcardWithTransaction(tx_hash, address, clubcard_url) {
    return {
        type: REGISTER_CLUBCARD_WITH_TRANSACTION,
        payload: {
            tx_hash, address, clubcard_url
        }
    }
}

export const REGISTER_CLUBCARD_WITH_TRANSACTION = 'wallet/registerClubcardWithTransaction';

export default registerClubcardWithTransactionSaga;