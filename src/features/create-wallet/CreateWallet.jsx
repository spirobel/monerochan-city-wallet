import React from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { saveWallet } from './createWalletSaga';
import { LeftCircleOutlined } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'

export default function CreateWallet() {
    // if you need to state be preserved in `chrome.storage.sync` use useChromeStorageSync
    const [value, setValue, isPersistent, error] = useChromeStorageLocal('counterLocal', 0);
    const dispatch = useDispatch()
    //mnemonic(optional), password: required, advanced: {restore from private view+spendkey, primary address},networkType,serverUri, restoreHeight)
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFieldsChange = (changedFields, allFields) => {
        console.log('changedFields:', changedFields, 'allFields:', allFields);
    };
    const onValuesChange = (changedValues, allValues) => {
        console.log('changedValues:', changedValues, 'allValues:', allValues);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                name="save-wallet"

                initialValues={{
                    name: "monerochans stash",
                    networkType: "stagenet", //switch to mainnet after leaving alpha
                    password: "password",
                    serverUri: "http://stagenet.xmr-tw.org:38081" //switch to mainnet after leaving alpha
                }}
                onFinish={onFinish}
                onFieldsChange={onFieldsChange}
                onValuesChange={onValuesChange}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a name for your wallet!' }]}
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
                <Form.Item name="mnemonic" label="seed phrase">
                    <Input.TextArea />
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
            <button
                onClick={() => {
                    setValue(prev => (prev + 1));
                }}
            >
                Increment in Local Storage
            </button>
            <div>Value: {value}</div>
            <div>Persisted in chrome.storage.local: {isPersistent.toString()}</div>
            <div>Error: {error}</div>
            <Button block size="default" type="primary" onClick={() => dispatch(saveWallet("name-of-wallet", { value }))}>
                save wallet
            </Button>
        </div>
    );
};