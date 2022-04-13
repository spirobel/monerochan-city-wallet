import React, { useState } from 'react';
import { Button, List, Card, Tooltip, Typography, Badge } from 'antd';
import { useDispatch } from 'react-redux';
import { LeftCircleOutlined, SyncOutlined, WalletOutlined, DeleteOutlined, WalletTwoTone } from '@ant-design/icons';
import { navigate } from '../navigation/navigation-slice'
import { useLiveQuery } from "dexie-react-hooks";
import { db } from '../../utils/dexie_db'
const { Text } = Typography;


export default function ListWallets() {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const wallets = useLiveQuery(
        () => db.wallet_config.toArray()
    );



    const [deleteWallet, setDeleteWallet] = useState(null) //we try to avoid: "do you really wanna do this?"-modals in the ui
    const [deleteCount, setDeleteCount] = useState(0);
    const deleteThisWallet = (item) => {
        if (deleteWallet === item.name) {
            if (deleteCount < 9) {
                setDeleteCount((prevCount) => prevCount + 1)
                return
            } else {
                setDeleteCount(0)
                setDeleteWallet(null)
                db.wallet_config.delete(item.name)
                db.wallet_data1.delete(item.name)
                db.wallet_data2.delete(item.name)
                //TODO:what about main wallet?
                return
            }
            //CASE clicked on a different wallet's delete button than before   
        } else {
            setDeleteCount(0)
            setDeleteWallet(item.name)
            return
        }
    }
    const deleteCountForThisWallet = (item) => {
        if (item === deleteWallet) {
            return deleteCount;
        }
        return 0
    }

    const dispatch = useDispatch()
    return (
        <div>
            <List
                size="small"
                bordered
                dataSource={wallets}
                renderItem={item => {
                    return (
                        <Card

                            actions={[
                                <Tooltip title="toogle sync">
                                    <SyncOutlined key="sync" onClick={() => db.wallet_config.update(item.name, { sync: !item.sync })} />
                                </Tooltip>,
                                <Tooltip title="turn into main wallet">
                                    <WalletOutlined key="main" onClick={() => db.wallet_config.update(item.name, { main_wallet: Date.now() })} />
                                </Tooltip>,
                                <Tooltip title="press 10 times to delete wallet">
                                    <Badge count={deleteCountForThisWallet(item)}>
                                        <DeleteOutlined key="delete" onClick={() => deleteThisWallet(item)} />
                                    </Badge>
                                </Tooltip>
                                ,
                            ]}
                            extra={item.name === mainWallet.name &&
                                <Tooltip title="main wallet">
                                    <WalletTwoTone />
                                </Tooltip>}
                            title={item.name}
                            style={{ marginBottom: '1em' }}>Card content
                            <br />
                            {item.sync && <Text type="success">wallet sync turned on</Text>}

                        </Card>

                    )
                }


                }
            />
            <Button onClick={() => dispatch(navigate("menu"))}>
                <LeftCircleOutlined />Back
            </Button>
            <Button onClick={() => dispatch(navigate("create-wallet"))}>
                create wallet
            </Button>
        </div>
    );
};