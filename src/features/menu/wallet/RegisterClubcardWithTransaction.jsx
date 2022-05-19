import React, { useState } from 'react';
import { List, Button, Form, Input, Card, Tooltip, Descriptions } from 'antd';
import Icon, { LeftCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDispatch } from 'react-redux';
import { go_back } from '../../navigation/navigation-slice'
import { db } from '../../../utils/dexie_db';
import MoneroLogo from '../../navigation/logo'
import { dispatchBackground } from '../../../utils/dispatchBackground';

import { registerClubcardWithTransaction } from '../../../pages/Background/background_app/registerClubcardWithTransactionSaga';
//import { monerojs } from '../../../pages/Background/background_app/moneroWalletUtils'
export const monerojs = require("monero-javascript");
const Monero = props => <Icon component={MoneroLogo} {...props} />;


export default function RegisterClubcardWithTransaction(props) {
    const [loading, setLoading] = useState(false)

    const [form] = Form.useForm();
    const onFinish = (values) => {
        dispatchBackground(registerClubcardWithTransaction(props.transaction.tx_hash, props.transaction.destination, values.message))
        setLoading(true)
    };

    const dispatch = useDispatch()

    return (
        <>
            <Form
                name="sign-message"
                form={form}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="clubcard url "
                    name="message"
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Register clubcard
                    </Button>
                </Form.Item>
            </Form>

            <Button onClick={() => dispatch(go_back())}>
                <LeftCircleOutlined />Back
            </Button>
        </>
    );
}