import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Image } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './Clubcards.module.scss'
import classNames from 'classnames';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import { dispatchBackground } from '../../utils/dispatchBackground';
import { openClubcard } from '../../pages/Background/background_app/openClubcardSaga';


const { Meta } = Card;


export function Clubcard(props) {

    const clubcard = useLiveQuery(
        async () => {

            return await db.clubcards.where({ url: props.id }).first()
        },
        [props.id]
    );
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <Card
                onClick={() => {
                    if (new URL(location.href).pathname === '/newtab.html') {
                        location.href = clubcard.url
                    } else {
                        dispatchBackground(openClubcard(clubcard.url))
                    }

                }}
                className={classNames("Clubcard")}
                hoverable
                bordered
                cover={
                    <Image
                        preview={false}
                        src={clubcard?.image}
                    />
                }
            >
                <Meta
                    description={clubcard?.description}
                />
            </Card>

        </div>
    );
}