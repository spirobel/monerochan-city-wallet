import { put } from 'redux-saga/effects'
import { syncWalletSync } from './syncWalletSyncSaga';

function* startupSaga() {
    //syncwallet sync over all the wallets on startup and open the ones that need to be opened/created, synced.
    db.wallet_config.each(wallet => put(syncWalletSync(wallet.name)));

}

export default startupSaga;