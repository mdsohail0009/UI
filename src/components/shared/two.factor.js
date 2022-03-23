import { Result, Button } from 'antd'
import React from 'react'
import ConnectStateProps from '../../utils/state.connect';

const TwoFactor = (props) => {
    return <React.Fragment style={{ top: 10 }}>
        <div className="main-container">
            < Result status="404"
                title={<h4 className="text-white">Please enable 2FA. Please click bellow button to go to security.</h4>}
                extra={<Button className="pop-btn px-36" onClick={() => { props.history.push("/userprofile") }}>Go to Security</Button>}
            />
        </div>
    </React.Fragment>
}

export default ConnectStateProps(TwoFactor)