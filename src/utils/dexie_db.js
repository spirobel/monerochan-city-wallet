// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    wallet_config: 'wallet_name, currently active',
    wallet_data1: 'wallet_name',
    wallet_data2: 'wallet_name',
});
