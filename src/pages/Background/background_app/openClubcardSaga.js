import { call, takeLeading } from 'redux-saga/effects'


function* workOpenClubcard(action) {
    yield call(() => chrome.tabs.create({ url: action.payload.url }))
}

function* openClubcardSaga() {
    yield takeLeading(OPEN_CLUBCARD, workOpenClubcard)
}


export function openClubcard(url) {
    return {
        type: OPEN_CLUBCARD,
        payload: {
            url
        }
    }
}

export const OPEN_CLUBCARD = 'wallet/openClubcard';

export default openClubcardSaga;