import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { navigate, selectCurrentPage } from '../../navigation/navigation-slice'
import { Card, Tooltip } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ImportOutlined } from '@ant-design/icons'
import styles from './WalletCard.module.scss'
import classNames from 'classnames';
import wallet from '../../../assets/img/wallet.jpg'
import { ACTIVE_WALLET } from '../../../pages/Background/background_app/createWalletSaga';
import { storage } from '../../../utils/storage';
const { Meta } = Card;


export function WalletCard(props) {
    const dispatch = useDispatch()
    const [activeWalletName] = useChromeStorageLocal(ACTIVE_WALLET, "");
    const [activeWallet, setActiveWallet] = useState({ name: " bla" })
    useEffect(() => {
        storage.get(activeWalletName, {})
            .then(aw => {
                setActiveWallet(() => Object.assign({}, aw))
            })
    }, [activeWalletName, setActiveWallet, ACTIVE_WALLET, storage])

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
                <Tooltip title="import old wallet from seed phrase">
                    <ImportOutlined key="import" onClick={() => dispatch(navigate("import-wallet"))} />
                </Tooltip>,
                <Tooltip title="list wallets">
                    <EllipsisOutlined key="ellipsis" onClick={() => dispatch(navigate("list-wallets"))} />
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