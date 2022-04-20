import React from 'react';
import { Table } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../utils/dexie_db';



export default function TransactionsTable(props) {
    const transactions = useLiveQuery(
        () => db.transactions.where({ wallet_name: props.wallet_name }).toArray(),
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



    return (

        <Table dataSource={transactions} columns={columns} />
    );
}