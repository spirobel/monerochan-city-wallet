import React from 'react';
import { Table, Button } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../utils/dexie_db';
import { dispatchBackground } from '../../utils/dispatchBackground';


export function Receive() {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );

    const addresses = useLiveQuery(
        async () => {
            const main_wallet = await db.wallet_config.orderBy('main_wallet').last()
            const subaddresses = await db.subaddress.where({ wallet_name: main_wallet.name }).toArray()
            return subaddresses
        }
    );


    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
        }
    ]

    return (
        <>
            <Button onClick={() => dispatchBackground(createAddress(mainWallet.name))}>
                create address!
            </Button>
            <Table dataSource={addresses} columns={columns} />
        </>

    );
}