import React, { useState } from 'react';
import { Button, Input, InputNumber, Form, Card, Space, Spin, Image, Alert } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { RightCircleOutlined } from '@ant-design/icons';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { createTransaction } from '../../pages/Background/background_app/createTransactionSaga';
import { relayTransaction } from '../../pages/Background/background_app/relayTransactionSaga';
import classNames from 'classnames';
const { Meta } = Card;


export function BuyClubcard(props) {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const draft_transaction = useLiveQuery(
        async () => {
            if (!mainWallet) { return undefined }
            let draft = await db.draft_transaction.where({ wallet_name: mainWallet.name }).first()
            setLoading(false)
            return draft
        },
        [mainWallet]
    );

    const [form] = Form.useForm();
    const onFinish = (values) => {
        dispatchBackground(createTransaction(mainWallet.name, values.address, values.amount))
        form.resetFields();
        setLoading(true)
    };
    const [loading, setLoading] = useState(false)

    return (
        <>
            {loading && <Spin size="large" tip="Creating transaction..." />
            }
            {(!loading && !draft_transaction) &&
                <>
                    <div className={classNames("ClubcardGrid")}>
                        <Card
                            className={classNames("Clubcard")}
                            hoverable
                            bordered
                            cover={
                                <Image
                                    preview={false}
                                    src={props?.clubcard?.image}
                                />
                            }
                        >
                            <Meta
                                description={props?.clubcard?.description}
                            />
                        </Card>

                    </div>
                    <Alert
                        message={<span style={{ color: "rgba(0, 0, 0, 0.45)" }}>click on the card to buy</span>}
                        description={<><span>url: {(new URL(props.clubcard.url)).hostname}</span><br></br><span> price: {props.clubcard.amount}</span></>}
                        type="info"
                        showIcon
                        style={{ margin: "49px" }}
                    />
                </>
            }
            {draft_transaction &&
                <Card title="New transaction" style={{ width: 300 }}>
                    <p>amount: {draft_transaction.amount}</p>
                    <p>destination:

                        <span style={{
                            width: "250px",
                            wordWrap: "break-word",
                            display: "inline-block"
                        }}>
                            {draft_transaction.address}
                        </span>

                    </p>
                    <p>fee: {draft_transaction.fee / 1000000000000}</p>
                    <Space>
                        <Button type="primary" danger onClick={() => db.draft_transaction.delete(mainWallet.name)}>
                            discard transaction
                        </Button>
                        <Button type="primary" onClick={() => dispatchBackground(relayTransaction(mainWallet.name))}>
                            send <RightCircleOutlined />
                        </Button>
                    </Space>
                </Card>
            }
        </>

    );
}