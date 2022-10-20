import { Result, Button } from 'antd'
import React from 'react'
import ConnectStateProps from '../../utils/state.connect';

const TwoFactor = (props) => {
    return <React.Fragment style={{ top: 10 }}>
        <div className="main-container">
            < Result status="404"
                // title={<h4 className="text-white">Please click on bellow button to go Security for enable 2FA.</h4>}
                title={<h4 className="text-white">Please click the button below to enable 2FA.</h4>}
                extra={<Button className="pop-btn px-36" onClick={() => { props.history.push("/userprofile/2") }}>Go to Security</Button>}
            />
        </div>
    </React.Fragment>
}

export default ConnectStateProps(TwoFactor)