// db.js
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    wallet_config: 'name, main_wallet, last_saved_time',
    wallet_data1: 'name',
    wallet_data2: 'name',
    transactions: '[wallet_name+tx_hash],url, amount, is_incoming, account_index,subaddress_index, address, num_suggested_confirmations, destinations,'
});
