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
    let nsp = await storage.get(nsp_name, data1) //1.get the next partion to save to


    const base64_arraybuffer = async (data) => {
        // Use a FileReader to generate a base64 data URI
        const base64url = await new Promise((r) => {
            const reader = new FileReader()
            reader.onload = () => r(reader.result)
            reader.readAsDataURL(new Blob([data]))
        })

        /*
        The result looks like 
        "data:application/octet-stream;base64,<your base64 data>", 
        so we split off the beginning:
        */
        return base64url.split(",", 2)[1]
    }

    // example use:
    const keysData = await base64_arraybuffer(data[0])
    const cacheData = await base64_arraybuffer(data[1])


    await storage.set({
        [nsp]: {
            keysData,
            cacheData
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
    const keysData = new Uint8Array(Buffer.from(data.keysData, 'base64'));
    const cacheData = new Uint8Array(Buffer.from(data.cacheData, 'base64'));
    return { keysData, cacheData }
}
