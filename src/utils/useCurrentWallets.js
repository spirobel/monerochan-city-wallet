import React, { useEffect, useState } from "react";
import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "../pages/Background/background_app/createWalletSaga";
import { storage } from './storage'
const STORAGE_AREA = 'local';
const useCurrentWallets = () => {
    const [awk, setAWK] = useState([]);
    const [aw, setAW] = useState([]);
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        storage.get(ALL_WALLET_KEYS, [])
            .then(res => {
                console.log("GET ALLWALLET KEYS first time", res)
                setAWK(res);
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                setIsPersistent(false);
                setError(error);
            });
    }, [ALL_WALLET_KEYS]);

    useEffect(() => {
        const newObject = awk.reduce(function (result, item, index) {
            result[item] = []
            return result
        }, {})
        storage.get(awk)
            .then(res => {
                console.log("GET ALLWALLETs first timeZZ", res, awk, newObject, this)
                if (!res) { res = [] }
                setAW(res);
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                setIsPersistent(false);
                setError(error);
            });
    }, [awk])

    useEffect(() => {
        const onChange = (changes, areaName) => {
            if (areaName === STORAGE_AREA && ALL_WALLET_KEYS in changes) {

                setAWK(changes[ALL_WALLET_KEYS].newValue);
                setIsPersistent(true);
                setError('');
            }
            for (let i in awk) {
                if (areaName === STORAGE_AREA && awk[i] in changes) {
                    setAW(prevAW => prevAW[awk[i]] = changes[awk[i]])
                    setIsPersistent(true);
                    setError('');
                }
            }

        };
        chrome.storage.onChanged.addListener(onChange);
        return () => {
            chrome.storage.onChanged.removeListener(onChange);
        };
    }, [awk, aw, STORAGE_AREA, ALL_WALLET_KEYS]);




    return [awk, aw, isPersistent, error];
}
export default useCurrentWallets;