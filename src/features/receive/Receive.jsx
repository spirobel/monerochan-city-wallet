import React from 'react';
import { List, Button } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { createAddress } from '../../pages/Background/background_app/createAddressSaga'


export function Receive() {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );

    const addresses = useLiveQuery(
        async () => {
            const main_wallet = await db.wallet_config.orderBy('main_wallet').last()
            if (!main_wallet) { return undefined }
            const subaddresses = await db.subaddress.where({ wallet_name: main_wallet.name }).toArray()
            return subaddresses
        }
    );

    return (
        <>
            <Button onClick={() => { if (!mainWallet) { return } dispatchBackground(createAddress(mainWallet.name)) }}>
                create address!
            </Button>
            <List
                size="small"
                bordered dataSource={addresses} rowKey={record => record.address}
                renderItem={item => {
                    return (
                        <li marginbottom={"2em"}>
                            <h3>address:</h3>
                            <span style={{
                                width: "500px",
                                wordWrap: "break-word",
                                display: "inline-block"
                            }}>
                                {item.address}
                            </span>
                        </li>
                    )
                }}
            />
        </>

    );
}