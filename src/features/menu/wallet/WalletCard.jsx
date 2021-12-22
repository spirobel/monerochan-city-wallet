import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, selectCurrentPage } from '../../navigation/navigation-slice'
import { Card, Tooltip } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './WalletCard.module.scss'
import classNames from 'classnames';
import wallet from '../../../assets/img/wallet.jpg'

const { Meta } = Card;


export function WalletCard(props) {
    const dispatch = useDispatch()

    return (
        <Card
            className={classNames(styles.WalletCard)}

            actions={[
                <Tooltip title="edit wallet">
                    <SettingOutlined key="setting" />
                </Tooltip>,
                <Tooltip title="create new wallet">
                    <EditOutlined key="edit" onClick={() => dispatch(navigate("create-wallet"))} />
                </Tooltip>,
                <Tooltip title="switch wallet">
                    <EllipsisOutlined key="ellipsis" />
                </Tooltip>,
            ]}
        >
            <Meta
                avatar={<img src={wallet} style={{ width: "150px" }} />}
                title="Wallet Name"
                description="This is your currently selected wallet"
            />
        </Card>
    );
}