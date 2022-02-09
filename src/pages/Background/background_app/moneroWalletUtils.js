import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "./createWalletSaga";
import { storage } from '../../../utils/storage'

const monerojs = require("monero-javascript");


export async function create_monero_wallet(wallet_config) {
    let config = {
        networkType: wallet_config.networkType,
        password: wallet_config.password,
        serverUri: wallet_config.serverUri,
        mnemonic: wallet_config.mnemonic
    }

    let wallet = await monerojs.createWalletFull(config);
    return wallet
}

export async function open_monero_wallet(wallet_config) {
    let wallet = await monerojs.openWalletFull(wallet_config);
    return wallet
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
    return new Promise((resolve) => {
        chrome.storage.local.get(ALL_WALLET_KEYS, function (awk) {
            resolve(awk[ALL_WALLET_KEYS]);
        })
    })
}

export function setAllWalletKeys(awk, name, content) {
    if (Array.isArray(awk)) { //1.add new name to awk
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