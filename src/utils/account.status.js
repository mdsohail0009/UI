import { Component } from "react";
import pending from '../assets/images/pending1.png';
import Acsacnner from '../../src/assets/images/scannerac.jpg';

class AccountStatus extends Component {
    render() {
        return<div className='sumSub-confirm text-white d-flex align-center'><div className='text-center cust-sumsub-font'><img src={pending} className="confirm-icon" alt={"success"} />   <div className='sumSub-review'>{this.props.customerState?.customerState==="Under Review"?"Your account is under review":<>Your account approval is in progress.
            <p className="approve-email">
             Contact our Customer success at  <a href = {`mailto: ${process.env.REACT_APP_ONBOARDING}`}>{process.env.REACT_APP_ONBOARDING}</a> for more information.</p></>}</div>
             {this.props.customerState?.customerState==="Under Review" 
            
             }</div>
            <div className='text-white cust-sumsub-font text-center'>
            <div className='sumSub-review sumsub-mb'>{this.props.customerState?.customerState==="Under Review"?"Please complete your application using the QR code or button below:":<>Your account approval is in progress.
            </>}</div>
            <img src={Acsacnner} width="150" />
            <div>
                
                 <a
                 className="download-btn sumsubactbtn"
                href={`https://qrfy.com/p/jKDd44d4ZD`}
                target="_blank"
              >
                Click here
              </a>
                 </div>
            </div>
            </div>
          
    }

}

export default AccountStatus;   