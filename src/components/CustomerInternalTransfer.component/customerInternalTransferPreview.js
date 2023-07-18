import React, { Component } from "react";
import { Form, Button, Typography, Alert, Spin, } from 'antd';
import apicalls from "../../api/apiCalls";

import NumberFormat from "react-number-format";
import Verifications from "../onthego.transfer/verification.component/verifications"
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
import { setSendFiatHead } from "../../reducers/buyFiatReducer";
import {internalCustomerTransferSave} from './api'
import DelcarationForm from '../personalInternalTransfer.component/successPage';
const { Text } = Typography; 
class CustomerTransferSummary extends Component {
  reviewScrool = React.createRef();
  state = {
    reviewDetails: this.props?.summaryDetails,
    errorMessage: null,
    verifyData: null, isBtnLoading: false, reviewDetailsLoading: false,
    isShowGreyButton: false,
    permissions: {},
    isSuccess:false,
  }
  componentDidMount() {
    getFeaturePermissionsByKeyName(`send_fiat`);
    this.reviewScrool.current.scrollIntoView(0,0);
    this.permissionsInterval = setInterval(this.loadPermissions, 200);
  }


  loadPermissions = () => {
    if (this.props.withdrawCryptoPermissions) {
      clearInterval(this.permissionsInterval);
      let _permissions = {};
      for (let action of this.props.withdrawCryptoPermissions?.actions) {
        _permissions[action.permissionName] = action.values;
      }
      this.setState({ ...this.state, permissions: _permissions });
    }
  }


saveWithdrawdata = async () => {
  const {summaryDetails}=this.props;
    this.setState({ ...this.state, isBtnLoading: true ,errorMessage:null})
    if (this.state.verifyData?.verifyData) {
        if (this.state.verifyData.verifyData.isPhoneVerified) {
            if (!this.state.verifyData.isPhoneVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify phone verification code"
                });
                this.reviewScrool.current.scrollIntoView(0,0);
                return;
            }
        }
        if (this.state.verifyData.verifyData.isEmailVerification) {
            if (!this.state.verifyData.isEmailVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify  email verification code"
                });
                this.reviewScrool.current.scrollIntoView(0,0);
                return;
            }
        }
        if (this.state.verifyData.verifyData.twoFactorEnabled) {
            if (!this.state.verifyData.isAuthenticatorVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify authenticator code"
                });
                this.reviewScrool.current.scrollIntoView(0,0);
                return;
            }
        }
        if (
          this.state.verifyData.verifyData.isPhoneVerified === "" &&
          this.state.verifyData.verifyData.isEmailVerification === "" &&
          this.state.verifyData.verifyData.twoFactorEnabled === ""
        ) {
            this.setState({
                ...this.state,
                errorMessage:
                    "Without Verifications you can't send. Please select send verifications from security section",
            });
            this.reviewScrool.current.scrollIntoView(0,0);
            return
        }
    }
    if (summaryDetails) {
        let obj = Object.assign({}, summaryDetails);
        obj["MemberWalletId"] = this.props.selectedWallet?.walletId ||this.props.selectedWallet?.id;
        obj["walletCode"] = this.props.selectedWallet?.walletCode||this.props.selectedWallet.currencyCode;
        obj["totalValue"] =summaryDetails?.totalAmount;
        obj["requestedAmount"] =summaryDetails?.requestedAmount;
        obj["docRepositories"]=summaryDetails?.docRepositories;
        obj["info"]=JSON.stringify(this.props?.trackAuditLogData);
        obj["CreatedBy"]=this.props.userProfile?.userName;    

      const saveRes = await internalCustomerTransferSave(obj)
      if (saveRes.ok) {
        this.props.dispatch(setSendFiatHead(true));
        this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
        this.props.dispatch(fetchMarketCoinData(true))
        this.setState({ ...this.state, isBtnLoading: false,errorMessage:null ,isSuccess:true})
      } else {
  
        this.setState({
          ...this.state,
          errorMessage: apicalls.isErrorDispaly(saveRes), isBtnLoading: false,isSuccess:false
        });
        this.reviewScrool.current.scrollIntoView(0,0);
      }
    }
  }
  isAllVerificationsFullfilled = (obj) => {
    const vdata=this.state.verifyData ||{}
    const vDetails=Object.keys(vdata).length===0?obj:this.state.verifyData;
    let _verficationDetails = { ...vDetails,...obj };
    let _verificationCount = 0;
    let _currentVerificationCount = 0;
    for (let key in _verficationDetails) {
      if (["isPhoneVerification", "isEmailVerification", "isAuthenticatorVerification"].includes(key) && _verficationDetails[key]) {
        _currentVerificationCount++;
      }
    }

    for (let key in _verficationDetails?.verifyData) {
      if (["isPhoneVerified", "isEmailVerification", "twoFactorEnabled"].includes(key) && _verficationDetails?.verifyData[key]) {
        _verificationCount++;
      }
    }
    return _verificationCount === _currentVerificationCount;
  }

  changesVerification = (obj) => {
    this.setState({ ...this.state, isShowGreyButton: this.isAllVerificationsFullfilled(obj), verifyData: {...this.state.verifyData,...obj} })
  }
  onReviewDetailsLoading = (val) => {
    this.setState({ ...this.state, reviewDetailsLoading: val })
  }

  verificationsData=(data)=>{
    if(data?.isLiveVerification && !data?.twoFactorEnabled && !data?.isEmailVerification && !data?.isPhoneVerified ){
      this.setState({ ...this.state, 
        isShowGreyButton: true ,
        verificationsData:data });
    }
  }
  render() {
    const {isShowGreyButton,isSuccess} =this.state;
    const {summaryDetails,selectedWallet}=this.props;
    return <React.Fragment>
  { !isSuccess && <React.Fragment>
          <div ref={this.reviewScrool}></div>
          <div Paragraph
            className='drawer-maintitle text-center'>Review Details Of Transfer</div>
          <Spin spinning={this.state.reviewDetailsLoading}>
            <Form className="send-fiatform"
              name="advanced_search"
              ref={this.formRef}
              onFinish={this.transferDetials}
              autoComplete="off">
                        {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}

              
            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
              <div className="adbook-head" >Transfer details</div>
            </div>
                  <div className="cust-summary-new">
              <div className="pay-list" style={{ alignItems: 'baseline' }}>
                <div className="summary-liststyle">Withdrawal amount</div>
                <div className="summarybal"><NumberFormat
                  value={`${summaryDetails?.requestedAmount}`}
                  thousandSeparator={true} displayType={"text"} /> {`${selectedWallet?.currencyCode || selectedWallet?.walletCode}`}</div>
              </div>
              <div className="pay-list" style={{ alignItems: 'baseline' }}>
                <div className="summary-liststyle">Effective Fees</div>
                <div className="summarybal"><NumberFormat
                  value={`${summaryDetails?.fee}`}
                  thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${selectedWallet?.currencyCode || selectedWallet?.walletCode}`}</div>
              </div>
              <div className="pay-list" style={{ alignItems: 'baseline' }}>
                <div className="summary-liststyle">How Much Beneficiary Will Receive</div>
                <div className="summarybal">
                  <NumberFormat
                    value={`${summaryDetails?.withdrawalAmount}`}
                    thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${selectedWallet?.currencyCode || selectedWallet?.walletCode}`}</div>
              </div>

                  </div>
                 
                                <div className="d-flex  justify-content">
                                    <div className="adbook-head">Recipient details</div>
                  </div>
                  <div className="cust-summary-new kpi-List sendfiat-summarystyle">
                <div className="kpi-divstyle" >
                                    <div className="kpi-label"> Personal/Business Name </div>
                                   <div> <Text className="kpi-val">{summaryDetails?.fullName}</Text></div>
                  </div>
               
                {summaryDetails?.email &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Email Address</div>
                                   <div> <Text className="kpi-val">{summaryDetails?.email}</Text></div>
                                </div>
                           }
                {summaryDetails?.phoneNumber && 
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Phone Number</div>
                                   <div> <Text className="kpi-val">{summaryDetails?.phoneNumber}</Text></div>
                                </div>
                          }
                         </div>
             
                <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} verificationsData={(data)=>this.verificationsData(data)}/>
                
                {this.state.permissions?.Send && 
            
                    <div className="text-right mt-36 create-account">
                      <Form.Item className="mb-0 mt-16">
                      <Button
                         htmlType="button"
                         onClick={() => { this.saveWithdrawdata(); }}
                         size="large"
                         block
                         className="pop-btn custom-send cust-disabled"
                        style={{ backgroundColor: !isShowGreyButton && '#7087FF', borderColor: !isShowGreyButton && '#7087FF' }}
                        loading={this.state.isBtnLoading}  disabled={!isShowGreyButton}>
                         Confirm & Continue
                       </Button>
                      </Form.Item>
                    </div>
                  }
              
            </Form>
          </Spin>
        </React.Fragment>}
   {isSuccess && <DelcarationForm back={this.props?.back}/>}
</React.Fragment>
  }
}
const connectStateToProps = ({ sendReceive, userConfig, menuItems, oidc,internalCustomerTransfer }) => {
  return {
    sendReceive,
    userProfile: userConfig?.userProfileInfo,
    trackAuditLogData: userConfig?.trackAuditLogData,
    withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,
    oidc: oidc?.user?.profile,
    selectedWallet:internalCustomerTransfer.selectedWallet,
    summaryDetails:internalCustomerTransfer.summaryDetails,
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CustomerTransferSummary));