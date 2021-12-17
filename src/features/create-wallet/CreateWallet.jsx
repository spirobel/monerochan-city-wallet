import React from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { saveWallet } from './createWalletSaga';


export default function CreateWallet() {
    // if you need to state be preserved in `chrome.storage.sync` use useChromeStorageSync
    const [value, setValue, isPersistent, error] = useChromeStorageLocal('counterLocal', 0);
    const dispatch = useDispatch()

    return (
        <div>
            <button
                onClick={() => {
                    setValue(prev => (prev + 1));
                }}
            >
                Increment in Local Storage
            </button>
            <div>Value: {value}</div>
            <div>Persisted in chrome.storage.local: {isPersistent.toString()}</div>
            <div>Error: {error}</div>
            <Button block size="default" type="primary" onClick={() => dispatch(saveWallet("name-of-wallet", { value }))}>
                save wallet
            </Button>
        </div>
    );
};