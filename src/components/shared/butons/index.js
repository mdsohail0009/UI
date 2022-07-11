import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import Translate from 'react-translate-component';

const SuisseBtn = ({ title, onClick, autoDisable = false, className = "", loading = false, disabled, onRefresh,htmlType="button" }) => {
    const [refresh, setRefresh] = useState(false);
    let timeInterval;

    const stopTimer = () => { //for counter stoping perpose added this method
        clearInterval(timeInterval)
    }

    const refreshTimer = () => {
        if (onRefresh) {
            onRefresh();
        }
        stopTimer();
        setRefresh(false);
    }
    useEffect(() => {
        stopTimer();
    }, [autoDisable]);// eslint-disable-line react-hooks/exhaustive-deps
    return refresh ? <Translate content={"suisse_btn_refresh"} component={Button} size="large" block className="pop-btn confirm-btn" onClick={() => refreshTimer()} htmlType={htmlType} /> :
        <Translate content={title} component={Button} disabled={disabled} size="large" block className={className} onClick={() => onClick()} loading={loading} htmlType={htmlType} />
}

export default SuisseBtn;