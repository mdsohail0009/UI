import { Component } from "react";
import pending from '../assets/images/pending1.png'
class AccountStatus extends Component {
    render() {
        return <div className='sumSub-confirm text-white text-center'><img src={pending} className="confirm-icon" alt={"success"} /><br />
            <span className='sumSub-review'>{this.props.customerState?.customerState==="Under Review"?"Your account is under review state":<>Your account approval is in progress.
            <p className="approve-email">
             Contact our customer success at  <a href = "mailto: process.env.REACT_APP_ONBOARDING">{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}</span>
           
            </div>
    }

}

export default AccountStatus;