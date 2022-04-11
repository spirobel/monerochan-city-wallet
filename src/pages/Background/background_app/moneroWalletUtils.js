import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "./createWalletSaga";
import { storage } from '../../../utils/storage'
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

export function getCurrentActiveWallet() {

    return new Promise((resolve) => {
        getCurrentActiveWalletName().then((awn) => {
            chrome.storage.local.get([awn], function (aw) {
                resolve(aw);
            })
        })

    })
}



export function getCurrentActiveWalletName() {
    return new Promise((resolve) => {
        chrome.storage.local.get(ACTIVE_WALLET, function (aw) {
            resolve(aw[ACTIVE_WALLET]);
        })
    })
}

export function getAllWalletKeys() {
    return storage.get(ALL_WALLET_KEYS)
}

export function setAllWalletKeys(awk, name, content) {
    if (Array.isArray(awk)) { //1.add new name to awk
        if (awk.includes(name)) {
            throw "wallet with this name already exists: name: " + name;
        };
        awk.push(name)
    }
    else {
        awk = [name]
    }
    awk = [...new Set(awk)] //2. remove duplicates from awk

    return storage.set({ //3.set awk, active wallet name and walletname: walletcontent
        [name]: content,
        [ACTIVE_WALLET]: name,
        [ALL_WALLET_KEYS]: awk
    })
}
