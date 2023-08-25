import { Component } from "react";
import pending from '../assets/images/pending1.png';
import InitialForm from "./initialForm";
import { BrowserView, MobileView} from 'react-device-detect';
class AccountStatus extends Component {
  render() {
    return <>
        <div className='sumSub-confirm cust-cord text-white text-center'>
          <div className="text-center">
          <img src={pending} className="confirm-icon" alt={"success"} /><br />
          <span className='sumSub-review '>{this.props.customerState?.customerState === "Under Review" ? "Your account is under review state" :<> <p className="sumsub-mb">Please Complete the final verification step by clicking on the link below
          <BrowserView> {<InitialForm />}</BrowserView>
          <MobileView>{<InitialForm />}</MobileView>
          </p>
            <p className="approve-email ">
              Contact our Customer success at <a href={`mailto: ${process.env.REACT_APP_ONBOARDING}`}>{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}</span></div>
          {this.props.customerState?.customerState === "Under Review" && <p className='approve-email' style={{ wordBreak: 'break-all' }}> Please contact administrator</p>}
        </div>
    </>
  }
}

export default AccountStatus; 