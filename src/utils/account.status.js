import { Component } from "react";
import success from '../assets/images/pending.png'
class AccountStatus extends Component {
    render() {
        return <div className='sumSub-confirm text-white text-center'><img src={success} className="confirm-icon" alt={"success"} /><br />
            <span className='sumSub-review'>Your approval is in pending state</span>
            <p className='p-0' style={{ wordBreak: 'break-all' }}> Please contact administrator</p></div>
    }

}

export default AccountStatus;