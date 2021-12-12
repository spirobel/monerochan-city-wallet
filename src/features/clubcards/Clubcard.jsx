import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import styles from './Clubcards.module.scss'
import classNames from 'classnames';


const { Meta } = Card;


export function Clubcard(props) {
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
                className={classNames(styles.Clubcard)}
                style={{ width: 150 }}
                cover={
                    <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                }
                actions={[
                    <SettingOutlined key="setting" />,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </div>
    );
}