import React, { useState } from 'react';
import { Button, Input, InputNumber, Form, Card, Space } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { RightCircleOutlined } from '@ant-design/icons';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { createTransaction } from '../../pages/Background/background_app/createTransactionSaga';
import { relayTransaction } from '../../pages/Background/background_app/relayTransactionSaga';
import MoneroSpinner from '../monero-spinner/MoneroSpinner';


export function Send() {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const draft_transaction = useLiveQuery(
        async () => {
            if (!mainWallet) { return undefined }
            let draft = await db.draft_transaction.where({ wallet_name: mainWallet.name, from_wallet_send_dialog: true }).first()
            setLoading(false)
            return draft
        },
        [mainWallet]
    );

    const [form] = Form.useForm();
    const onFinish = (values) => {
        dispatchBackground(createTransaction(mainWallet.name, values.address, values.amount))
        form.resetFields();
        setLoading(true)
    };
    const [loading, setLoading] = useState(false)

    return (
        <>
            {loading && <MoneroSpinner size="large" tip="Creating transaction..." />
            }
            {(!loading && !draft_transaction) &&
                <Form
                    name="save-wallet"
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ amount: 1 }}
                >
                    <Form.Item
                        label="address"
                        name="address"
                        rules={[{ required: true, message: 'Please input the desitionation address!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="amount"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the transaction amount!',
                            },
                        ]}
                    >
                        <InputNumber
                            style={{
                                width: 100,
                            }}
                            min="0"
                            step="0.1"
                            stringMode
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create transaction
                        </Button>
                    </Form.Item>
                </Form>
            }
            {draft_transaction &&
                <Card title="New transaction" style={{ width: 300 }}>
                    <p>amount: {draft_transaction.amount}</p>
                    <p>destination:

                        <span style={{
                            width: "250px",
                            wordWrap: "break-word",
                            display: "inline-block"
                        }}>
                            {draft_transaction.address}
                        </span>

                    </p>
                    <p>fee: {draft_transaction.fee / 1000000000000}</p>
                    <Space>
                        <Button type="primary" danger onClick={() => db.draft_transaction.delete(draft_transaction.id)}>
                            discard transaction
                        </Button>
                        <Button type="primary" onClick={() => dispatchBackground(relayTransaction(draft_transaction.id))}>
                            send <RightCircleOutlined />
                        </Button>
                    </Space>
                </Card>
            }
        </>

    );
}