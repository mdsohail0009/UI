import React, { useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import App from '../components/app.component/App';
import { Modal } from 'antd';
import { userManager } from './index'
export default function IdleCmp(props) {
    const [showIdleModal, setIdleModal] = useState(false);
    const handleOnIdle = event => {
        setIdleModal(true);
        userManager.signoutRedirect();
    }

    const handleOnActive = event => {


    }

    const handleOnAction = event => {

    }

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 15,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 100
    })

    return (
        <div>
            <App />
            <Modal title="Session timedout" visible={showIdleModal} closable={false} closeIcon={false} footer={<></>}>
                <h4>Please wait...</h4>
            </Modal>
        </div>
    )
}