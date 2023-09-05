import { Component } from "react";
import spinner from '../assets/images/Spinner.gif';
import pending from '../assets/images/pending1.png';
import Litebox from "./litebox";
import { BrowserView, MobileView} from 'react-device-detect';
class AccountStatus extends Component {
  render() {
    return <>
        <div className='sumSub-confirm cust-cord text-white text-center'>
          <div className="text-center">
          {this.props.customerState?.customerState === "Under Review" && <img src={spinner} className="confirm-icon" alt={"success"} />}
          {this.props.customerState?.customerState !== "Under Review" && <img src={pending} className="confirm-icon" alt={"success"} />}
          <br />
          <span className='sumSub-review '>{this.props.customerState?.customerState === "Under Review" ? "Your account is under review state" :<> <p className="sumsub-mb">Please Complete the final verification step by clicking on the link below
          <BrowserView> {<Litebox />}</BrowserView>
          <MobileView>{<Litebox />}</MobileView>
          </p>
            <p className="approve-email ">
              Contact our Customer success at <a href={`mailto: ${process.env.REACT_APP_ONBOARDING}`}>{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}</span>
              {this.props.customerState?.customerState === "Under Review" && <p className='approve-email' style={{ wordBreak: 'break-all' }}> Please contact administrator</p>}
              </div>
        </div>
    </>
  }
}

export default AccountStatus; 