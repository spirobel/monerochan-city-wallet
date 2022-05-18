import React from 'react';
import { Card, Image, Alert } from 'antd';
import classNames from 'classnames';

const { Meta } = Card;


export function BoughtClubcardSuccess(props) {

    return (
        <>
            <div className={classNames("ClubcardGrid")}>
                <a href={props.clubcard.url}>
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
                </a>
            </div>
            <Alert
                message={<span style={{ color: "rgba(0, 0, 0, 0.45)" }}>click on the card to access </span>}
                description={<><span>you have been granted access to this card!</span><br></br><span> take a look at what is behind it!</span></>}
                type="success"
                showIcon
                style={{ margin: "49px" }}
            />
        </>


    );
}