import { db } from "../../../utils/dexie_db"

export const monerojs = require("monero-javascript");

export class WalletListener extends monerojs.MoneroWalletListener {
    constructor() {
        super();
        console.log("whatup", this)
    }
    onNewBlock(height) {
        console.log("itshappening")
        console.log("new block", height)
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


