import { db } from "../../../utils/dexie_db"
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
        db.wallet_config.where({ name: this.wallet_name }).first().then(wallet => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 1)
            const one_minute_ago = now.getTime();
            if (wallet.last_saved_time < one_minute_ago) {
                Window.background_store.dispatch(saveWallet(this.wallet_name))
            } //last saved before one_minute ago 
        })

    }
    onOutputReceived(output) {
        let txHash = output.getTx().getHash();
        let isConfirmed = output.getTx().isConfirmed();

        Window.background_store.dispatch(saveWallet(this.wallet_name))
        saveTransaction(this.wallet_name, txHash, { isConfirmed })

        //https://github.com/monero-ecosystem/monero-javascript/issues/60
        const monero_wallet = Window.wallets[this.wallet_name]
        monero_wallet.getTx(txHash).then(tx => {
            let transfers = tx.getIncomingTransfers()
            saveTransaction(this.wallet_name, txHash, transfers[0].state)
        });
    }
    onOutputSpent(output) {
        let txHash = output.getTx().getHash();
        let isConfirmed = output.getTx().isConfirmed();

        Window.background_store.dispatch(saveWallet(this.wallet_name))
        saveTransaction(this.wallet_name, txHash, { isConfirmed })

        //https://github.com/monero-ecosystem/monero-javascript/issues/60
        const monero_wallet = Window.wallets[this.wallet_name]
        monero_wallet.getTx(txHash).then(tx => {
            let transfer = tx.getOutgoingTransfer() //note: singular vs plural in received handler
            saveTransaction(this.wallet_name, txHash, transfer.state)
        });
    }
    onBalancesChanged(newBalance, newUnlockedBalance) {
        db.wallet_config.update(this.wallet_name, {
            newBalance: monerojs.BigInteger.parse(newBalance).toString(),
            newUnlockedBalance: monerojs.BigInteger.parse(newUnlockedBalance).toString(),
        })
        console.log("changed balance", newBalance)

    }
    onSyncProgress(height, startHeight, endHeight, percentDone, message) {
        console.log("sync percentage done", percentDone, message)
    }

}
//mandatory: wallet_name, tx_hash optional: data .... our transaction model is: transfer plus tx_hash
export function saveTransaction(wallet_name, tx_hash, data) {
    return db.transactions.add({
        wallet_name,
        tx_hash,
        ...data
    }).catch(() => {
        if (data) {
            db.transactions.update([wallet_name, tx_hash], data)
        }
    })
}
