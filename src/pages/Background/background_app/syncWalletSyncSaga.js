import { call, put, takeEvery } from 'redux-saga/effects'
import { loadWalletData, open_monero_wallet, monerojs, start_monero_wallet_sync } from "./moneroWalletUtils"
import { storage } from '../../../utils/storage'


function* openWallet(wallet_config, action) {
    const { keysData, cacheData } = yield call(loadWalletData, action.payload.name)
    let config = {
        networkType: wallet_config.networkType,
        password: wallet_config.password,
        keysData,
        cacheData
    }
    const monero_wallet = yield call(open_monero_wallet, config)
    console.log("SERVER URI", wallet_config.serverUri)
    let sh = yield call([monero_wallet, "getSyncHeight"])
    console.log("synchheigt before daemon connection:", sh)
    yield call([monero_wallet, "setDaemonConnection"], wallet_config.serverUri) // setDaemon Connection
    let sh2 = yield call([monero_wallet, "getSyncHeight"])
    console.log("synchheigt before daemon connection:", sh, "after", sh2)
    return monero_wallet;
}

function* workSyncWallet(action) {

    //0. get wallet config and check if we need to sync
    const wallet_config = yield call([storage, "get"], action.payload.name)


    //1.check if wallet object exists
    //2.if not load wallet data and open wallet

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
            //todo stop syncing call this it is async
            yield call([monero_wallet, "stopSyncing"])
            //todo save wallet data
            yield call([monero_wallet, "close"])
            Window.wallets[action.payload.name] = null;
            return
        }

    } else { //open monero wallet if it does not exist already
        if (!wallet_config.sync) {
            //just return asap, dont open wallet
            return
        }
        monero_wallet = yield call(openWallet, wallet_config, action)
        Window.wallets[action.payload.name] = monero_wallet
    }

    //3.start syncing
    //4.add monero wallet listener



    class WalletListener extends monerojs.MoneroWalletListener {
        constructor() {
            super();
        }

        onOutputReceived(output) {
            let amount = output.getAmount();
            let txHash = output.getTx().getHash();
            let isConfirmed = output.getTx().isConfirmed();
            let isLocked = output.getTx().isLocked();
            console.log("output received", output, output.getTx())

        }
        onOutputSpent(output) {
            console.log("output spent", output, output.getTx())
        }
        onBalancesChanged(newBalance, newUnlockedBalance) {
            console.log("changed balance", newBalance)

        }
        onSyncProgress(height, startHeight, endHeight, percentDone, message) {
            console.log("sync percentage done", percentDone, message)
        }
    }
    //let listener = new WalletListener();
    //console.log("wallet", monero_wallet, listener)

    // receive notifications when funds are received, confirmed, and unlocked
    //yield call([monero_wallet, "addListener"], listener)
    //monero_wallet.addListener(listener)
    console.log("after addlistener")
    yield call(start_monero_wallet_sync, monero_wallet)

    // synchronize in the background every 5 seconds
    //yield call([monero_wallet, "startSyncing"], 1000)


    console.log("after syncing", monero_wallet.getListeners())
    // monero_wallet.addListener(new class extends monerojs.MoneroWalletListener {
    //     onSyncProgress(height, startHeight, endHeight, percentDone, message) {
    //         console.log("sync percentage done", percentDone, message)
    //     }
    // })
    console.log("after second try", monero_wallet.getListeners())
    monero_wallet.getSyncHeight().then(x => {
        console.log("getSyncHeight", x)
        monero_wallet.getHeight().then(x => {
            console.log("getHeight", x)


            monero_wallet.getDaemonConnection().then(x => {
                console.log("deaemn", x)
                monero_wallet.getDaemonHeight().then(x => console.log("DAEMONHEIGHT", x))
                // monero_wallet.sync(new class extends monerojs.MoneroWalletListener {

                //     onNewBlock(height) {
                //         console.log("itshappening")
                //         console.log("new block", height)
                //     }

                //     onSyncProgress(height, startHeight, endHeight, percentDone, message) {
                //         console.log("sync percentage done", percentDone, message)
                //     }
                // }, 1043315).then(z => {
                //     console.log("sync ", z)
                //     monero_wallet.isSynced().then(x => console.log("after sync isSynced", x))
                //     monero_wallet.getTransfers().then(x => console.log("transfers", x))
                //     monero_wallet.getBalance().then(x => console.log("balance", x))
                //     monero_wallet.getTxs().then(x => console.log("gettxs", x))
                //     monero_wallet.getHeight().then(x => console.log("getHeight", x))
                //     monero_wallet.getSyncHeight().then(x => console.log("getSyncHeight", x))
                // })
                monero_wallet.getTransfers().then(x => console.log("deaemn", x))
                monero_wallet.getTransfers().then(x => console.log("transfers", x))
                monero_wallet.isConnectedToDaemon().then(x => console.log("isConnectedToDaemon", x))
                monero_wallet.isSynced().then(x => console.log("isSynced", x))
                monero_wallet.getPrimaryAddress().then(x => console.log("primaryaddress", x))


            })


        })


    }
    )




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