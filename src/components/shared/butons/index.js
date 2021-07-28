import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import Translate from 'react-translate-component';

const SuisseBtn = ({ title, onClick, autoDisable = false, duration = 10000, className = "", loading = false, disabled, onRefresh }) => {
    const [refresh, setRefresh] = useState(false);
    const [seconds, setSeconds] = useState(10);
    let timeInterval;
    let maxCount = duration / 1000;
    let count = 10;
    const startTimer = () => {
        timeInterval = setInterval(() => {
            let sec = count - 1;
            setSeconds(sec);
            count = count - 1;
            if (sec==0) { count = 10; setSeconds(10); clearInterval(timeInterval); setRefresh(true); }
        }, 1000);
    }
    const refreshTimer = () => {
        if (onRefresh) {
            onRefresh();
        }
        startTimer();
        setRefresh(false);
    }
    useEffect(() => {
        startTimer();
    }, [autoDisable]);
    return refresh ? <Translate content={"suisse_btn_refresh"} component={Button} size="large" block className={className} onClick={() => refreshTimer()} /> : <Translate with={{ counter: `(${seconds})` }} content={title} component={Button} disabled={disabled} size="large" block className={className} onClick={() => onClick()} loading={loading} />
}

export default SuisseBtn;