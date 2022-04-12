// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    wallet_config: 'name, main_wallet',
    wallet_data1: 'name',
    wallet_data2: 'name',
});
