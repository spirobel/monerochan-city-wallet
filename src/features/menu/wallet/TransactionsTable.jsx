import React from 'react';
import { List, Button, Card, Tooltip, Descriptions, Space } from 'antd';
import Icon, { LeftCircleOutlined, WalletOutlined, EditOutlined, LoginOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDispatch } from 'react-redux';
import { go_back, navigate } from '../../navigation/navigation-slice'
import { db } from '../../../utils/dexie_db';
import MoneroLogo from '../../navigation/logo'
//import { monerojs } from '../../../pages/Background/background_app/moneroWalletUtils'
export const monerojs = require("monero-javascript");
const Monero = props => <Icon component={MoneroLogo} {...props} />;


export default function TransactionsTable(props) {
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
            <List
                size="small"
                bordered dataSource={transactions} rowKey={record => record.tx_hash}
                renderItem={transaction => {
                    return (
                        <Card
                            title={<h4>{transaction?.tx?.state?.isIncoming ? "received money " : "spent money "}</h4>}
                            extra={transaction?.tx?.state?.isIncoming ?
                                <Tooltip title="incoming">
                                    <WalletOutlined style={{
                                        color: "#52c41a",
                                    }} />
                                </Tooltip> :
                                <Space>
                                    <Tooltip title="sign message with transaction">
                                        <EditOutlined key="setting" onClick={() => dispatch(navigate({
                                            destination: "signMessageWithTransaction",
                                            transaction: {
                                                tx_hash: transaction.tx_hash,
                                                destination: transaction.destinations[0].state.address
                                            }
                                        }
                                        ))} />
                                    </Tooltip>
                                    <Tooltip title="manually register clubcard with transaction">
                                        <LoginOutlined key="setting" onClick={() => dispatch(navigate({
                                            destination: "registerClubcardWithTransaction",
                                            transaction: {
                                                tx_hash: transaction.tx_hash,
                                                destination: transaction.destinations[0].state.address
                                            }
                                        }
                                        ))} />
                                    </Tooltip>
                                    <Tooltip title="outgoing">
                                        <WalletOutlined style={{
                                            color: "#f5222d",
                                        }} />
                                    </Tooltip>
                                </Space>


                            }>
                            <Descriptions bordered>
                                <Descriptions.Item label="amount">
                                    {Object.assign(new monerojs.BigInteger(), transaction.amount) / 1000000000000} <Monero />
                                </Descriptions.Item>
                                <Descriptions.Item label="destination">{transaction?.tx?.state?.isIncoming ?
                                    transaction.address : transaction.destinations[0].state.address}</Descriptions.Item>
                                <Descriptions.Item label="fee">{Object.assign(new monerojs.BigInteger(), transaction.tx.state.fee) / 1000000000000}</Descriptions.Item>
                                <Descriptions.Item label="tx hash">{transaction.tx_hash}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                    )
                }}
            />
            <Button onClick={() => dispatch(go_back())}>
                <LeftCircleOutlined />Back
            </Button>
        </>
    );
}