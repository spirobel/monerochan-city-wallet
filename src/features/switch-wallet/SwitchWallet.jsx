import React, { useEffect, useState } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { Form, Input, Button, Checkbox, Radio, List, Card, Tooltip, Typography, Badge } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { saveWallet } from '../../pages/Background/background_app/createWalletSaga';
import { LeftCircleOutlined, ToTopOutlined, SyncOutlined, WalletOutlined, DeleteOutlined, WalletTwoTone } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'
import useCurrentWallets from '../../utils/useCurrentWallets';
import { ACTIVE_WALLET } from "../../pages/Background/background_app/createWalletSaga";

const { Text } = Typography;


export default function CreateWallet() {
    const [mainWallet, setMainWallet] = useChromeStorageLocal(ACTIVE_WALLET);
    const [deleteWallet, setDeleteWallet] = useState(null) //we try to avoid: "do you really wanna do this?"-modals in the ui
    const [deleteCount, setDeleteCount] = useState(0);
    const deleteThisWallet = (item) => {
        if (deleteWallet === item) {
            if (deleteCount < 9) {
                setDeleteCount((prevCount) => prevCount + 1)
                return
            } else {
                setDeleteCount(0)
                setDeleteWallet(null)
                removeWallet(item)
                //TODO:what about main wallet?
                return
            }
            //CASE clicked on a different wallet's delete button than before   
        } else {
            setDeleteCount(0)
            setDeleteWallet(item)
            return
        }
    }
    const deleteCountForThisWallet = (item) => {
        if (item === deleteWallet) {
            return deleteCount;
        }
        return 0
    }
    const { awk, aw, toggleSync, removeWallet } = useCurrentWallets();
    const dispatch = useDispatch()
    return (
        <div>
            <List
                size="small"
                bordered
                dataSource={awk}
                renderItem={item => {
                    let title = item;
                    let sync = false
                    let extra = null;
                    if (aw[item]) {
                        title = aw[item].name
                        sync = aw[item].sync
                        console.log("usestat rerender", sync)
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
                                <Tooltip title="press 10 times to delete wallet">
                                    <Badge count={deleteCountForThisWallet(item)}>
                                        <DeleteOutlined key="delete" onClick={() => deleteThisWallet(item)} />
                                    </Badge>
                                </Tooltip>
                                ,
                            ]}
                            extra={extra}
                            title={title}
                            style={{ marginBottom: '1em' }}>Card content
                            <br />
                            {sync && <Text type="success">wallet sync turned on</Text>}

                            {console.log("INSIDE", aw[item])}</Card>

                    )
                }


                }
            />
            <Button key="edit" onClick={() => dispatch(navigate("create-wallet"))} >create wallet</Button>
        </div>
    );
};