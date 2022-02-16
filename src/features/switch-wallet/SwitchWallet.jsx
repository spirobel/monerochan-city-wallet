import React, { useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio, List, Card, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { saveWallet } from '../../pages/Background/background_app/createWalletSaga';
import { LeftCircleOutlined, ToTopOutlined, SyncOutlined, WalletOutlined, DeleteOutlined } from '@ant-design/icons';
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
                renderItem={item => {
                    let title = item;
                    if (aw[item]) {
                        title = aw[item].name
                    }
                    return (
                        <Card

                            actions={[
                                <Tooltip title="toogle sync">
                                    <SyncOutlined key="sync" />
                                </Tooltip>,
                                <Tooltip title="turn into main wallet">
                                    <WalletOutlined key="main" onClick={() => dispatch(navigate("create-wallet"))} />
                                </Tooltip>,
                                <Tooltip title="delete wallet">
                                    <DeleteOutlined key="delete" onClick={() => dispatch(navigate("switch-wallet"))} />
                                </Tooltip>,
                            ]}
                            title={title}
                            style={{ 'margin-bottom': '1em' }}>Card content{console.log("INSIDE", aw[item])}</Card>

                    )
                }


                }
            />
            <Button key="edit" onClick={() => dispatch(navigate("create-wallet"))} >create wallet</Button>
        </div>
    );
};