import React from 'react';
import { Table, Button } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDispatch } from 'react-redux';
import { go_back } from '../../navigation/navigation-slice'
import { db } from '../../../utils/dexie_db';



export default function TransactionsTable(props) {
    const transactions = useLiveQuery(
        () => { if (!props.wallet_name) { return undefined } db.transactions.where({ wallet_name: props.wallet_name }).toArray() },
        [props.wallet_name]
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
            <Table dataSource={transactions} columns={columns} />
            <Button onClick={() => dispatch(go_back())}>
                <LeftCircleOutlined />Back
            </Button>
        </>
    );
}