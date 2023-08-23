import { Component } from "react";
import spinner from '../assets/images/Spinner.gif';
import Acsacnner from '../../src/assets/images/scannerac.jpg';
import AcsacnnerIo from '../../src/assets/images/scannerIo.png'
import pending from '../assets/images/pending1.png';

class AccountStatus extends Component {
  render() {
    return <>
      {this.props.customerState?.customerState == "Under Review" ? (
        <div className='sumSub-confirm text-white align-center'>
          <div className='text-center cust-sumsub-font'>
            <img src={spinner} className="confirm-icon" alt={"success"} />
            <div className='sumSub-review'>
              {this.props.customerState?.customerState === "Under Review" ? "Your account is under review" : <>Your account approval is in progress.
                <p className="approve-email">
                  Contact our Customer success at <a href={`mailto: ${process.env.REACT_APP_ONBOARDING}`}>{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}
            </div>
            {this.props.customerState?.customerState ==="Under Review"
            }</div>
          <div className='text-white cust-sumsub-font text-center'>
            <div className='sumSub-review sumsub-mb'>{this.props.customerState?.customerState === "Under Review" ? "Please complete your application using the QR code or button below:" : <>Your account approval is in progress.
            </>} </div>
            {process.env.REACT_APP_ACCOUNT_STATUS_SCANNER_IS==="true" &&
            <img src={AcsacnnerIo} width="150" />}
            {process.env.REACT_APP_ACCOUNT_STATUS_SCANNER_IS==="false" &&
            <img src={Acsacnner} width="150" />}
            <div>
                
                 <a
                 className="download-btn sumsubactbtn"
                href={`${process.env.REACT_APP_ACCOUNT_STATUS_SCANNER}`}
                target="_blank"
              >
                Click here
              </a>
                 </div>
            </div>
            </div>
          
  
      ) : (
        <div className='sumSub-confirm text-white text-center'>
          <div className="text-center">
          <img src={spinner} className="confirm-icon" alt={"success"} /><br />
          <span className='sumSub-review'>{this.props.customerState?.customerState === "Under Review" ? "Your account is under review state" : <>Your account approval is in progress.
            <p className="approve-email">
              Contact our Customer success at <a href={`mailto: ${process.env.REACT_APP_ONBOARDING}`}>{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}</span></div>
          {this.props.customerState?.customerState === "Under Review" && <p className='approve-email' style={{ wordBreak: 'break-all' }}> Please contact administrator</p>}
        </div>
    </>
  }
}

export default AccountStatus; 