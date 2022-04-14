import { call, put, takeEvery } from 'redux-saga/effects'
import { monerojs, WalletListener } from "./moneroWalletUtils"
import { saveWallet } from './saveWalletSaga'

function* workSyncWallet(action) {

    //0. get wallet config and check if we need to sync
    const wallet_config = yield call(() => db.wallet_config.where({ name: action.payload.name }).first())


    //1.check if wallet object exists
    //2.if not load wallet data and open wallet or create wallet if wallet didnt exist before

    function isObject(objValue) {
        return objValue && typeof objValue === 'object' && objValue.constructor === Object;
    }
    let monero_wallet = null;
    if (!isObject(Window.wallets)) {
        Window.wallets = {}

    }


    if (Window.wallets[action.payload.name]) {
        monero_wallet = Window.wallets[action.payload.name]
        if (!wallet_config.sync) {
            yield call([monero_wallet, "stopSyncing"])
            yield put(saveWallet(action.payload.name))
            return
        }

    } else { //open or create monero wallet if it does not exist already
        if (!wallet_config.sync) {
            //just return asap, dont open wallet (because syncing is turned off)
            return
        }
        if (!wallet_config.last_wallet_save_slot) {
            //CREATE WALLET
            monero_wallet = yield call([monerojs, "createWalletFull"], {
                networkType: wallet_config.networkType,
                password: wallet_config.password,
                mnemonic: wallet_config.mnemonic,
                serverUri: wallet_config.serverUri,
                restoreHeight: wallet_config.restoreHeight
            })
            Window.wallets[action.payload.name] = monero_wallet
            yield put(saveWallet(action.payload.name))
        }
        //OPEN WALLET
        const wallet_data = yield call(() =>
            db[wallet_config.last_wallet_save_slot].
                where({ name: action.payload.name }).first())

        monero_wallet = yield call([monerojs, "openWalletFull"], {
            networkType: wallet_config.networkType,
            password: wallet_config.password,
            serverUri: wallet_config.serverUri,
            keysData: wallet_data.data[0],
            cacheData: wallet_data.data[1]
        })
        Window.wallets[action.payload.name] = monero_wallet
    }
    //3.add monero wallet listener
    // receive notifications when funds are received, confirmed, and unlocked
    yield call([monero_wallet, "addListener"], new WalletListener(action.payload.name))
    //4. start syncing 
    // synchronize in the background every 5 seconds
    yield call([monero_wallet, "startSyncing"], 5000)
}

function* syncWalletSyncSaga() {
    yield takeEvery(SYNC_WALLET_SYNC, workSyncWallet)
}


export function syncWalletSync(name) {
    return {
        type: SYNC_WALLET_SYNC,
        payload: {
            name
        }
    }
}

export const SYNC_WALLET_SYNC = 'wallet/SYNC_WALLET_SYNC';


export default syncWalletSyncSaga;