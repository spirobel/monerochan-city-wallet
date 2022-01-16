import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "./createWalletSaga";
const monerojs = require("monero-javascript");


export async function create_monero_wallet(wallet_config) {
    let wallet = await monerojs.createWalletFull(wallet_config);
    return wallet
}

export function getCurrentActiveWallet() {

    return new Promise((resolve) => {
        getCurrentActiveWalletName.then((awn) => {
            chrome.storage.local.get([awn], function (aw) {
                resolve(aw);
            })
        })

    })
}



export function getCurrentActiveWalletName() {
    return new Promise((resolve) => {
        chrome.storage.local.get([ACTIVE_WALLET], function (aw) {
            resolve(aw);
        })
    })
}

export function getAllWalletKeys() {
    return new Promise((resolve) => {
        chrome.storage.local.get([ALL_WALLET_KEYS], function (awk) {
            resolve(awk);
        })
    })
}