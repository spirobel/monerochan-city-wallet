import React, { useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { saveWallet } from '../../pages/Background/background_app/createWalletSaga';
import { LeftCircleOutlined } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'
import useCurrentWallets from '../../utils/useCurrentWallets';

export default function CreateWallet() {
    const [draftWallet, setdraftWallet] = useChromeStorageLocal('wallet-draft');
    const [awk, aw] = useCurrentWallets();
    console.log(aw, awk)
    const dispatch = useDispatch()
    return (
        <div>
            <List
                size="small"
                bordered
                dataSource={awk}
                renderItem={item => <List.Item>{aw[item]}</List.Item>}
            />
            <Button key="edit" onClick={() => dispatch(navigate("create-wallet"))} >create wallet</Button>
        </div>
    );
};