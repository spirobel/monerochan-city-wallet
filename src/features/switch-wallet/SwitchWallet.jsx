import React, { useEffect } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio, List, Card, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { saveWallet } from '../../pages/Background/background_app/createWalletSaga';
import { LeftCircleOutlined, ToTopOutlined, SyncOutlined, WalletOutlined, DeleteOutlined, WalletTwoTone } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'
import useCurrentWallets from '../../utils/useCurrentWallets';
import { ACTIVE_WALLET } from "../../pages/Background/background_app/createWalletSaga";



export default function CreateWallet() {
    const [draftWallet, setdraftWallet] = useChromeStorageLocal('wallet-draft');
    const [mainWallet, setMainWallet] = useChromeStorageLocal(ACTIVE_WALLET);

    const { awk, aw, toggleSync } = useCurrentWallets();
    const dispatch = useDispatch()
    return (
        <div>
            <List
                size="small"
                bordered
                dataSource={awk}
                renderItem={item => {
                    let title = item;
                    let extra = null;
                    if (aw[item]) {
                        title = aw[item].name
                    }
                    if (item === mainWallet) {
                        extra =
                            <Tooltip title="main wallet">
                                <WalletTwoTone />
                            </Tooltip>
                    }
                    return (
                        <Card

                            actions={[
                                <Tooltip title="toogle sync">
                                    <SyncOutlined key="sync" onClick={() => toggleSync(item)} />
                                </Tooltip>,
                                <Tooltip title="turn into main wallet">
                                    <WalletOutlined key="main" onClick={() => setMainWallet(item)} />
                                </Tooltip>,
                                <Tooltip title="delete wallet">
                                    <DeleteOutlined key="delete" onClick={() => dispatch(navigate("delete-wallet"))} />
                                </Tooltip>,
                            ]}
                            extra={extra}
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