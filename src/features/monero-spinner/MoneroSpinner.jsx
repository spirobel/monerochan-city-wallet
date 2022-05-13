import { Spin } from 'antd'
import React from 'react';
import MoneroIcon from './MoneroIcon';

function MoneroSpinner(props) {

    return (
        <>
            <Spin indicator={<MoneroIcon className={"ant-spin-dot-spin"} />} {...props} style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }} />

        </>
    );
}

export default MoneroSpinner;