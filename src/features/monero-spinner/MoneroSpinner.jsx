import { Spin } from 'antd'
import React from 'react';
import MoneroIcon from './MoneroIcon';

function MoneroSpinner(props) {

    return (
        <>
            <Spin indicator={<MoneroIcon className={"ant-spin-dot-spin"} />} {...props} />

        </>
    );
}

export default MoneroSpinner;