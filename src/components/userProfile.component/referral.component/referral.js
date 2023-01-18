import React, { Component } from "react";
import Translate from "react-translate-component";
import { Typography, Button, message, Dropdown,Menu, Spin, Alert } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    EmailShareButton, EmailIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";
import apicalls from "../../../api/apiCalls"
import { connect } from "react-redux";
import Loader from "../../../Shared/loader";
const { Title, Paragraph, Text } = Typography;
class Referral extends Component {
    state = {
        referaldata:null,
        isLoading:false,
        errorMsg:null
    }
    componentDidMount(){
        this.loadData()
    }
    loadData = async () =>{
        this.setState({...this.state,isLoading:true})
        const res  = await apicalls.getReferalDetails();
        if(res.ok){
            this.setState({...this.state,referaldata:res.data,isLoading:false,errorMsg:null})
        }else{
            this.setState({...this.state,isLoading:false,errorMsg:this.isErrorDispaly(res)})
        }
    }
    success = () => {
        message.success('Address was copied!');
    };
    get shareMenu() {
        return 
      
    }
	isErrorDispaly = (objValue) => {
		if (objValue.data && typeof objValue.data === "string") {
		  return objValue.data;
		} else if (
		  objValue.originalError &&
		  typeof objValue.originalError.message === "string"
		) {
		  return objValue.originalError.message;
		} else {
		  return "Something went wrong please try again!";
		}
	  };
	render() {
        const { Text } = Typography;
		return (
      <>
       {this.state.isLoading ? (
				<Loader />
			) : (
        <div>
        {this.state.errorMsg && (
          <Alert
            type="error"
            description={this.state.errorMsg}
            onClose={() => this.setState({ ...this.state, errorMsg: null })}
            showIcon
          />
        )}

          
            <div
              className=""
              style={{ padding: "0" }}
            >
              	<Translate
						content="referr"
						component={Title}
						className="basicinfo"
					/>
             
              </div>
           
            <div className="referral-bg-style basicprofile-info">
            <div className="crypto-address">
              <div>
            <Translate content="Referral_code" className="profile-label" component={Text} />
              <div className="profile-value mv-profile-value">
                {this.state.referaldata?.referralCode || "---"}
              </div>
              </div>
              <div className="walletadrs mb-copy">
                <CopyToClipboard
                  text={this.state.referaldata?.referralCode || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
            </div>
            </div>
            <div className="referral-bg-style basicprofile-info">
            <div className="crypto-address">
              <div>
            <Translate content="Personal_referral_link" className="profile-label" component={Text} />
              <div className="profile-value mv-profile-value">
                {this.state.referaldata?.referrallink || "---"}
              </div>
              </div>
            
            <div className="walletadrs mb-copy">
                <CopyToClipboard
                  text={this.state.referaldata?.referrallink || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
              </div>
              </div>
              <div className="referral-bg-style basicprofile-info">
            <div className="crypto-address">
            <div>
            <Translate content="Business_referral_link" className="profile-label" component={Text} />
              <div className="profile-value mv-profile-value">
                {this.state.referaldata?.referralBusinesslink || "---"}
              
              </div>
              </div>
              <div className="walletadrs mb-copy">
                <CopyToClipboard
                  text={this.state.referaldata?.referralBusinesslink || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
            
            </div>
            </div>
          
            <div className="crypto-address share-width-align">
              <div>
            <div className='refferral-share-btn'overlay={this.shareMenu} trigger={['click']} >Share</div>
                <div >             
                <WhatsappShareButton te url={this.state.referaldata?.referrallink||'---'} title={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +" "+(this.state.referaldata?.referralBusinesslink || '---') +". Click the below link to continue registration"} >
                    <span className='icon lg whats-app c-pointer'/>
                </WhatsappShareButton>
          
                <EmailShareButton url={this.state.referaldata?.referrallink||'---'} subject={"Suissebase Referral code"}
                 body={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +(this.state.referaldata?.referralBusinesslink || '---') +
                 ". Click the below link to continue registration"} separator={";"} >
                    <span className='icon lg mail-app c-pointer'  />
                </EmailShareButton>
            
             
                   
            </div>
            </div>
          <Button
                htmlType="submit"
                size="large"
                className="profile-sm-btn referral-patner-btn"
                style={{ marginRight: "" }}
                onClick={() =>
                  window.open(process.env.REACT_APP_PARTNER_UI_URL, "_blank")
                }
              >
                <Translate content="Go_to_Partner" />
              </Button>
              </div>
        </div>
        )}
      </>
    );
	}
}
const connectStateToProps = ({ userConfig }) => {
	return {
		userConfig: userConfig.userProfileInfo,
	};
};
export default connect(connectStateToProps) (Referral);