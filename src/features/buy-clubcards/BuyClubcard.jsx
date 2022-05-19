import React, { useState } from 'react';
import { Button, Card, Space, Image, Alert } from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { RightCircleOutlined } from '@ant-design/icons';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import MoneroSpinner from '../monero-spinner/MoneroSpinner';
import { createClubcardTransaction } from '../../pages/Background/background_app/createClubcardTransactionSaga';
import { relayClubcardTransaction } from '../../pages/Background/background_app/relayClubcardTransactionSaga';
import { navigate_popup } from '../popup-navigation/popup-navigation-slice';
import MoneroIcon from '../monero-spinner/MoneroIcon';
const { Meta } = Card;


export function BuyClubcard(props) {
    const mainWallet = useLiveQuery(
        () => db.wallet_config.orderBy('main_wallet').last()
    );
    const draft_transaction = useLiveQuery(
        async () => {
            if (!mainWallet) { return undefined }
            let draft = await db.draft_transaction.where({ wallet_name: mainWallet.name, clubcard_url: props.clubcard.url }).first()
            setLoading(false)
            return draft
        },
        [mainWallet, props.clubcard.url]
    );
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    return (
        <>
            {loading && <MoneroSpinner tip="Creating transaction..." />
            }
            {(!loading && !draft_transaction) &&
                <>
                    <div className={classNames("ClubcardGrid")}>
                        <Card
                            onClick={() => {
                                dispatchBackground(createClubcardTransaction(props.clubcard.url))
                                setLoading(true)
                            }}
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
                <>
                    <Card title="New transaction" style={{
                        width: 300,
                        width: "300px",
                        top: "78px",
                        marginLeft: "47px"
                    }}>
                        <p>amount: {draft_transaction.amount} <MoneroIcon /> </p>
                        <p>url:

                            <span style={{
                                width: "250px",
                                wordWrap: "break-word",
                                display: "inline-block"
                            }}>
                                {props.clubcard.url}
                            </span>

                        </p>
                        <p>fee: {draft_transaction.fee / 1000000000000}</p>
                        <Space>
                            <Button type="primary" danger onClick={() => db.draft_transaction.delete(draft_transaction.id)}>
                                discard transaction
                            </Button>
                            <Button type="primary" onClick={() => {
                                dispatchBackground(relayClubcardTransaction(props.clubcard.url))
                                dispatch(navigate_popup("sendingMoneySpinner"))
                            }}>
                                pay <RightCircleOutlined />
                            </Button>
                        </Space>
                    </Card>
                    <Alert
                        message={<span style={{ color: "rgba(0, 0, 0, 0.45)" }}>make sure the url matches your expectation</span>}
                        description={<><span>it is the place you will gain access to. </span><br></br><span> if there are misspellings, discard the transaction!</span></>}
                        type="warning"
                        showIcon
                        style={{
                            marginLeft: "19px",
                            marginRight: "26px",
                            top: "104px"
                        }}
                    />
                </>
            }
        </>

    );
}