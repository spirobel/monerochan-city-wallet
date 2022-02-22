import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { navigate, selectCurrentPage } from '../../navigation/navigation-slice'
import { Card, Tooltip } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './WalletCard.module.scss'
import classNames from 'classnames';
import wallet from '../../../assets/img/wallet.jpg'
import { ACTIVE_WALLET } from '../../../pages/Background/background_app/createWalletSaga';
const { Meta } = Card;


export function WalletCard(props) {
    const dispatch = useDispatch()
    const [activeWalletName] = useChromeStorageLocal(ACTIVE_WALLET, "");
    const [activeWallet, setActiveWallet] = useState({ name: " bla" })
    useEffect(() => {
        chrome.storage.local.get(activeWalletName, function (aw) {
            setActiveWallet(value => Object.assign({}, aw[activeWalletName]))
        })
    }, [activeWallet, setActiveWallet, ACTIVE_WALLET])

    return (
        <Card
            className={classNames(styles.WalletCard)}

            actions={[
                <Tooltip title="sign message with wallet">
                    <EditOutlined key="setting" />
                </Tooltip>,
                <Tooltip title="create new wallet">
                    <SettingOutlined key="edit" onClick={() => dispatch(navigate("create-wallet"))} />
                </Tooltip>,
                <Tooltip title="switch wallet">
                    <EllipsisOutlined key="ellipsis" onClick={() => dispatch(navigate("switch-wallet"))} />
                </Tooltip>,
            ]}
        >
            <Meta
                avatar={<img src={wallet} style={{ width: "150px" }} />}
                title={activeWallet.name}
                description="This is your currently selected wallet"
            />
        </Card>
    );
}