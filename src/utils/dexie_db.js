// db.js
import Dexie from 'dexie';

export const db = new Dexie('monerochan_db');
db.version(1).stores({
    wallet_config: 'name, main_wallet, last_saved_time',
    wallet_data1: 'name',
    wallet_data2: 'name',
    transactions: '[wallet_name+tx_hash],isConfirmed, url, amount, isIncoming, accountIndex,subaddressIndex, address, numSuggestedConfirmations, destinations',
    draft_transaction: 'wallet_name',
    subaddress: 'address, wallet_name, account_index, subaddress_index',
    identities: '++id, address, tx_hash, wallet_name, username, is_archived, image, display_index, description',
    clubcards: '++id, address, tx_hash, url, wallet_name, host_identity_address, clubcard_name, is_archived, image, display_index, description, display_name, notifications'
});
