import { Component } from "react";
import pending from '../assets/images/pending1.png'
class AccountStatus extends Component {
    render() {
        return <div className='sumSub-confirm text-white text-center'><img src={pending} className="confirm-icon" alt={"success"} /><br />
            <span className='sumSub-review'>Your approval is in progress state</span>
            <p className='p-0' style={{ wordBreak: 'break-all' }}> Please contact administrator</p></div>
    }

}

export default AccountStatus;