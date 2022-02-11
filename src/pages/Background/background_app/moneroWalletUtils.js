import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "./createWalletSaga";
import { storage } from '../../../utils/storage'

const monerojs = require("monero-javascript");


export async function create_monero_wallet(wallet_config) {
    let config = {
        networkType: wallet_config.networkType,
        password: wallet_config.password,
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
export async function saveWalletData(name, data) {
    //similar to the way firmware OTA updates work on microcontrollers we have two slots in case the write was not complete
    const data1 = name + "_data1"
    const data2 = name + "_data2"
    const nsp_name = name + "_next_save_partion"
    const nsp = await storage.get(nsp_name, data1) //1.get the next partion to save to
    await storage.set({
        [nsp]: {
            keysData: data[0],
            cacheData: data[1]
        }
    })
    nsp = nsp === data1 ? data2 : data1; //2.recalculate the new next save partition value
    await storage.set({ //3.set the next save partition to the new value.
        [nsp_name]: nsp
    })
}

export async function loadWalletData(name) {
    //assumption: we should always be able to find saved data,
    //because createWalletSaga immediatly saves the wallet after creation.
    const data1 = name + "_data1"
    const data2 = name + "_data2"
    const nsp_name = name + "_next_save_partion"
    const nsp = await storage.get(nsp_name, data1)
    const current_save_partition = nsp === data1 ? data2 : data1;
    const data = await storage.get(current_save_partition)
    return data //{keysData, cacheData}
}
