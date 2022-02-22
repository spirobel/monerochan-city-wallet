import React, { useEffect, useState, useCallback } from "react";
import { ACTIVE_WALLET, ALL_WALLET_KEYS } from "../pages/Background/background_app/createWalletSaga";
import { storage } from './storage'
const STORAGE_AREA = 'local';
const useCurrentWallets = () => {
    const [awk, setAWK] = useState([]);
    const [aw, setAW] = useState({});
    const [isPersistent, setIsPersistent] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        storage.get(ALL_WALLET_KEYS, [])
            .then(res => {
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
        storage.get(awk)
            .then(res => {
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
                    setAW(prevAW => {
                        const newAW = Object.assign({}, prevAW);
                        newAW[awk[i]] = changes[awk[i]].newValue;
                        return newAW;
                    })
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
    const toggleSync = useCallback((walletName) => {
        const wallet = aw[walletName]
        wallet.sync = !wallet.sync
        storage.set({ [walletName]: wallet })
            .then(() => {
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                setIsPersistent(false);
                setError(error);
            });
    }, [storage, aw]);

    const removeWallet = useCallback((walletName) => {

        function removeFromAllWalletKeys(lawk, name) {
            lawk = lawk.filter(e => e !== name); //remove name from local awk array
            storage.set({
                [ALL_WALLET_KEYS]: lawk
            }).then(() => {
                setIsPersistent(true);
                setError('');
            })
                .catch(error => {
                    setIsPersistent(false);
                    setError(error);
                });
        }

        removeFromAllWalletKeys(awk, walletName)
        storage.remove(walletName)
            .then(() => {
                setIsPersistent(true);
                setError('');
            })
            .catch(error => {
                setIsPersistent(false);
                setError(error);
            });
    }, [storage, aw]);

    return { awk, aw, toggleSync, removeWallet };
}
export default useCurrentWallets;