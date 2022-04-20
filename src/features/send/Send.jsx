import React from 'react';
import { Button, Input, InputNumber } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { RightCircleOutlined } from '@ant-design/icons';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { createTransaction } from '../../pages/Background/background_app/createTransactionSaga';
import { relayTransaction } from '../../pages/Background/background_app/relayTransactionSaga';


export function Send() {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const draft_transaction = useLiveQuery(
        () => db.draft_transaction.where({ wallet_name: mainWallet.name }).first(),
        [mainWallet]
    );

    const [form] = Form.useForm();
    const onFinish = (values) => {
        dispatchBackground(createTransaction(mainWallet.name, values.address, values.amount))
        form.resetFields();
    };


    return (
        <>
            <Form
                name="save-wallet"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
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
                        defaultValue="1"
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
            {draft_transaction &&
                <Card title="New transaction" style={{ width: 300 }}>
                    <p>amount: {draft_transaction.amount}</p>
                    <p>destination: {draft_transaction.destination}</p>
                    <Button type="primary" danger onClick={() => db.draft_transaction.delete(mainWallet.name)}>
                        discard transaction
                    </Button>
                    <Button type="primary" onClick={() => dispatchBackground(relayTransaction(mainWallet.name))}>
                        send <RightCircleOutlined />
                    </Button>
                </Card>
            }
        </>

    );
}