import React from 'react';
import { List, Button, Card, Tooltip, Descriptions } from 'antd';
import Icon, { LeftCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDispatch } from 'react-redux';
import { go_back } from '../../navigation/navigation-slice'
import { db } from '../../../utils/dexie_db';
import MoneroLogo from '../../navigation/logo'
//import { monerojs } from '../../../pages/Background/background_app/moneroWalletUtils'
export const monerojs = require("monero-javascript");
const Monero = props => <Icon component={MoneroLogo} {...props} />;


export default function SignMessageWithTransaction(props) {
    console.log(props.transaction)
    const transactions = useLiveQuery(
        async () => {
            if (!props.wallet_name) { return undefined }
            return await db.transactions
                .where('wallet_name')
                .equals(props.wallet_name).toArray()
        },
    );


    const columns = [
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Direction',
            dataIndex: 'is_incoming',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Destinations',
            dataIndex: 'destinations',
        },
    ]

    const dispatch = useDispatch()

    return (
        <>
            <Button onClick={() => dispatch(go_back())}>
                <LeftCircleOutlined />Back
            </Button>
        </>
    );
}