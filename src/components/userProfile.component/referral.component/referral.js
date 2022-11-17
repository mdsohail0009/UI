import React, { Component } from "react";
import Translate from "react-translate-component";
import Typography from "antd/lib/typography";
import Button from "antd/lib/button";
import { message } from "antd";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Spin from "antd/lib/spin";
import Alert from "antd/lib/alert";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EmailShareButton from "react-share/lib/EmailShareButton";
import EmailIcon from "react-share/lib/EmailIcon";
import WhatsappShareButton from "react-share/lib/WhatsappShareButton";
import WhatsappIcon from "react-share/lib/WhatsappIcon";
import apicalls from "../../../api/apiCalls"
import { connect } from "react-redux";

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

        <Spin spinning={this.state.isLoading}>
          <div className="box basic-info">
            <div
              className="box mb-flex contact-info coin-bal"
              style={{ padding: "0 24px" }}
            >
              	<Translate
						content="referr"
						component={Text}
						className="basicinfo"
					/>
              <Button
                htmlType="submit"
                size="large"
                className="pop-btn"
                style={{ marginRight: "-20px" }}
                onClick={() =>
                  window.open(process.env.REACT_APP_PARTNER_UI_URL, "_blank")
                }
              >
                <Translate content="Go_to_Partner" />
              </Button>
            </div>
            <div className="crypto-address mt-12">
            <Translate content="Referral_code" className="mb-0 fw-400 text-secondary" component={Text} />
              <div className="mb-0 fw-600 text-white-30 walletadrs">
                {this.state.referaldata?.referralCode || "---"}
              </div>
              <div className="mb-0 fw-600 text-white-30 walletadrs">
                <CopyToClipboard
                  text={this.state.referaldata?.referralCode || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="fs-20 text-white-30 custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
            </div>
            <div className="crypto-address mt-12">
            <Translate content="Personal_referral_link" className="mb-0 fw-400 text-secondary" component={Text} />
              <div className="mb-0 fw-600 text-white-30 walletadrs mb-copy">
                {this.state.referaldata?.referrallink || "---"}
              </div>
              <div className="mb-0 fw-600 text-white-30 walletadrs mb-copy">
                <CopyToClipboard
                  text={this.state.referaldata?.referrallink || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="fs-20 text-white-30 custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
            </div>
            <div className="crypto-address mt-12">
            <Translate content="Business_referral_link" className="mb-0 fw-400 text-secondary" component={Text} />
              <div className="mb-0 fw-600 text-white-30 walletadrs mb-copy">
                {this.state.referaldata?.referralBusinesslink || "---"}
              </div>
              <div className="mb-0 fw-600 text-white-30 walletadrs mb-copy">
                <CopyToClipboard
                  text={this.state.referaldata?.referralBusinesslink || "---"}
                  options={{ format: 'text/plain' }}>
                  <Text
                    copyable
                    className="fs-20 text-white-30 custom-display"
                  ></Text>
                </CopyToClipboard>
              </div>
            </div>

            <Dropdown overlay={this.shareMenu} trigger={['click']}>
              <Button
                style={{ borderRadius: 25, height: 50 }}
                className="mt-36 text-upper share-btn fw-600 fs-14"
                block
                onClick={e => e.preventDefault()}
              >
               <Translate content="share" />
              </Button>
            </Dropdown>
          </div>
        </Spin>
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