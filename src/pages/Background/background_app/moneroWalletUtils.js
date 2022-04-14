import { db } from "../../../utils/dexie_db"
import store from "./background_store"
import { saveWallet } from "./saveWalletSaga";

export const monerojs = require("monero-javascript");

export class WalletListener extends monerojs.MoneroWalletListener {
    constructor(wallet_name) {
        super();
        console.log("whatup", this)
        this.wallet_name = wallet_name
    }
    onNewBlock(height) {
        console.log("itshappening")
        console.log("new block", height)
        const wallet = db.wallet_config.where({ name: this.wallet_name }).first()
        const now = new Date();
        const one_minute_ago = now.setMinutes(now.getMinutes() - 1).getTime();
        if (wallet.last_saved_time < one_minute_ago) {
            store.dispatch(saveWallet(this.wallet_name))
        } //last saved before one_minute ago 
    }
    onOutputReceived(output) {
        let amount = output.getAmount();
        let txHash = output.getTx().getHash();
        let isConfirmed = output.getTx().isConfirmed();
        let isLocked = output.getTx().isLocked();
        console.log("output received", output, output.getTx())
        store.dispatch(saveWallet(this.wallet_name))
    }
    onOutputSpent(output) {
        console.log("output spent", output, output.getTx())
        store.dispatch(saveWallet(this.wallet_name))
    }
    onBalancesChanged(newBalance, newUnlockedBalance) {
        console.log("changed balance", newBalance)

    }
    onSyncProgress(height, startHeight, endHeight, percentDone, message) {
        console.log("sync percentage done", percentDone, message)
    }

}


