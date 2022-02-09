const STORAGE_AREA = 'local';
export const storage = {
    get: (key, defaultValue) => {
        const keyObj = defaultValue === undefined ? key : { [key]: defaultValue };
        return new Promise((resolve, reject) => {
            chrome.storage[STORAGE_AREA].get(keyObj, items => {
                const error = chrome.runtime.lastError;
                if (error) return reject(error);
                resolve(items[key]);
            });
        });
    },
    set: (keys_values) => {
        return new Promise((resolve, reject) => {
            chrome.storage[STORAGE_AREA].set(keys_values, () => {
                const error = chrome.runtime.lastError;
                error ? reject(error) : resolve();
            });
        });
    },
};