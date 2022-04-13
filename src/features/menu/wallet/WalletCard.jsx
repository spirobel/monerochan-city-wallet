import React from 'react';
import { useDispatch } from 'react-redux';
import { navigate, } from '../../navigation/navigation-slice'
import { Card, Tooltip } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ImportOutlined } from '@ant-design/icons'
import styles from './WalletCard.module.scss'
import classNames from 'classnames';
import wallet from '../../../assets/img/wallet.jpg'
import { db } from '../../../utils/dexie_db';
import { useLiveQuery } from "dexie-react-hooks";

const { Meta } = Card;


export function WalletCard(props) {
    const dispatch = useDispatch()
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );

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
                title={mainWallet.name}
                description="This is your currently selected wallet"
            />
        </Card>
    );
}