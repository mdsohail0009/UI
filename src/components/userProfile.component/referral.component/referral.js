import React, { Component } from "react";
import Translate from "react-translate-component";
import { Typography, Button, message, Dropdown,Menu, Spin, Alert, Row, Col ,Form} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";
import apicalls from "../../../api/apiCalls"
import { connect } from "react-redux";

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
        const res  = await apicalls.getReferalDetails(this.props.userConfig.id);
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
        return <Menu className="share-adrs">
            <Menu.Item>
                <WhatsappShareButton te url={this.state.referaldata?.referrallink||'---'} title={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +" "+(this.state.referaldata?.referralBusinesslink || '---') +". Click the below link to continue registration"} >
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
            </Menu.Item>
            <Menu.Item>
                <EmailShareButton url={this.state.referaldata?.referrallink||'---'} subject={"Suissebase Referral code"}
                 body={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +(this.state.referaldata?.referralBusinesslink || '---') +
                 ". Click the below link to continue registration"} separator={";"} >
                    <EmailIcon size={32} round={true} />
                </EmailShareButton>
            </Menu.Item>
            {/* <Menu.Item>
                <TwitterShareButton url={this.state.referaldata?.referrallink||'---'} title={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +(this.state.referaldata?.referralBusinesslink || '---') + ". Click the below link to continue registration"} >
                    <TwitterIcon size={32} round={true} />
                </TwitterShareButton>
            </Menu.Item>
            <Menu.Item>
                <FacebookShareButton url={this.state.referaldata?.referrallink||'---'} quote={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +(this.state.referaldata?.referralBusinesslink || '---') + ". Click the below link to continue registration"} >
                    <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
            </Menu.Item>
            <Menu.Item>
                <TelegramShareButton url={this.state.referaldata?.referrallink||'---'} title={"Welcome to suissebase use this referral code to create an account "+(this.state.referaldata?.referralCode||'---') +(this.state.referaldata?.referralBusinesslink || '---') + ". Click the below link to continue registration"} >
                    <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
            </Menu.Item> */}
        </Menu>
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
        {this.state.errorMsg && (
          <Alert
            type="error"
            description={this.state.errorMsg}
            onClose={() => this.setState({ ...this.state, errorMsg: null })}
            showIcon
          />
        )}

        {/* <Spin spinning={this.state.isLoading}> */}
          
            <div
              className=""
              style={{ padding: "0" }}
            >
              {/* <Text className="basicinfo mb-0" style={{ marginLeft: '-22px' }}>My Referral</Text> */}
              	<Translate
						content="referr"
						component={Title}
						className="basicinfo"
					/>
              {/* <ul class="m-0 pl-0">
						
							<li className="fs-20 text-yellow c-pointer" onClick={()=>window.open(process.env.REACT_APP_PARTNER_UI_URL, "_blank")}>
								Go to Partner
							</li>
					</ul> */}
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
                <Paragraph 
                  text={this.state.referaldata?.referralBusinesslink || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    // className="custom-display"
                  ></Text>
                </Paragraph>
              </div>
            </div>
            </div>
            {/* <Dropdown overlay={this.shareMenu} trigger={['click']}>
              <Button
                style={{ borderRadius: 25, height: 50 }}
                className="share-btn"
                block
                onClick={e => e.preventDefault()}
              >
               <Translate content="share" />
              </Button>
            </Dropdown> */}
            <div className="crypto-address share-width-align">
              <div>
            <div className='refferral-share-btn'>Share</div>
                <div>
                    <span className='icon lg whats-app c-pointer' />
                    <span className='icon lg mail-app c-pointer' />
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
        {/* </Spin> */}
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