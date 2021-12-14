import React from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';


export default function CreateWallet() {
    // if you need to state be preserved in `chrome.storage.sync` use useChromeStorageSync
    const [value, setValue, isPersistent, error] = useChromeStorageLocal('counterLocal', 0);
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
        </div>
    );
};