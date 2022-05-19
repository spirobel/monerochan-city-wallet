import React, { useState } from 'react';
import { List, Button, Form, Input, Card, Tooltip, Descriptions } from 'antd';
import Icon, { LeftCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDispatch } from 'react-redux';
import { go_back } from '../../navigation/navigation-slice'
import { db } from '../../../utils/dexie_db';
import MoneroLogo from '../../navigation/logo'
import { dispatchBackground } from '../../../utils/dispatchBackground';

import { signMessageWithTransaction } from '../../../pages/Background/background_app/signMessageWithTransactionSaga';
//import { monerojs } from '../../../pages/Background/background_app/moneroWalletUtils'
export const monerojs = require("monero-javascript");
const Monero = props => <Icon component={MoneroLogo} {...props} />;


export default function SignMessageWithTransaction(props) {

    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const [form] = Form.useForm();
    const onFinish = (values) => {
        dispatchBackground(signMessageWithTransaction(props.transaction.tx_hash, props.transaction.destination, values.message))
        setLoading(true)
    };
    const [loading, setLoading] = useState(false)
    console.log(props.transaction)


    const dispatch = useDispatch()

    return (
        <>
            <Form
                name="sign-message"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                initialValues={{ amount: 1 }}
            >
                <Form.Item
                    label="message to sign: "
                    name="message"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Sign message
                    </Button>
                </Form.Item>
            </Form>

            {mainWallet?.tx_proof &&
                <p><div>signature:</div>

                    <span style={{
                        width: "486px",
                        wordWrap: "break-word",
                        display: "inline-block"
                    }}>
                        {mainWallet.tx_proof}
                    </span>

                </p>
            }
            <Button onClick={() => dispatch(go_back())}>
                <LeftCircleOutlined />Back
            </Button>
        </>
    );
}