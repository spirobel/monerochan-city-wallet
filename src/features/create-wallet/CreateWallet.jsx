import React, { useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { ALL_WALLET_KEYS, saveWallet } from '../../pages/Background/background_app/createWalletSaga';
import { LeftCircleOutlined } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../utils/dexie_db';

export default function CreateWallet() {
    const initalValues = {
        name: "monerochans stash",
        networkType: "stagenet", //switch to mainnet after leaving alpha
        password: "password",
        serverUri: "http://stagenet.xmr-tw.org:38081", //switch to mainnet after leaving alpha
        sync: true,
    }
    const [form] = Form.useForm();
    const [draftWallet, setdraftWallet] = useChromeStorageLocal('wallet-draft', initalValues);
    let wallet_name_used_already = useLiveQuery(
        async () => {
            const wc = await db.wallet_config.where({ name: draftWallet.name }).count()
            return wc !== 0;
        },
        [draftWallet.name]
    );
    const dispatch = useDispatch()
    //mnemonic(optional), password: required, advanced: {restore from private view+spendkey, primary address},networkType,serverUri, restoreHeight)
    const onFinish = (values) => {
        console.log('Success:', values);
        dispatchBackground(saveWallet(draftWallet))
        setdraftWallet(initalValues)
        form.resetFields();
        dispatch(navigate("menu"))
    };
    const onValuesChange = (changedValues, allValues) => {
        setdraftWallet(allValues)
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                name="save-wallet"
                form={form}
                initialValues={draftWallet}
                onFinish={onFinish}
                onValuesChange={onValuesChange}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a name for your wallet!' }, {
                        validator: (_, value) => {
                            if (wallet_name_used_already) {
                                return Promise.reject(new Error('A wallet with this name already exists. Pick a different one!'));
                            }
                            return Promise.resolve();
                        }
                    }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="networkType" label="network type" >
                    <Radio.Group>
                        <Radio.Button value="mainnet">mainnet</Radio.Button>
                        <Radio.Button value="testnet">testnet</Radio.Button>
                        <Radio.Button value="stagenet">stagenet</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="server link"
                    name="serverUri"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 1,
                    }}
                >

                    <Button onClick={() => dispatch(navigate("menu"))}>
                        <LeftCircleOutlined />Back
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};