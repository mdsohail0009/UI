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
import {setClearAmount} from '../../reducers/sendreceiveReducer'
import { setStep } from '../../reducers/buysellReducer';
import {saveWithdraw} from './api'
import DelcarationForm from './successPage';
const { Text } = Typography; 
class CustomerTransferSummary extends Component {
  reviewScrool = React.createRef();
  state = {
    step: this.props.selectedCurrency ? "enteramount" : "selectcurrency",
    filterObj: [],
    selectedCurrency: this.props.selectedCurrency,
        amount: "",
    onTheGoObj: { amount: '', description: '' },
    reviewDetails: this.props?.reviewDetails,
    errorMessage: null,
    codeDetails: { abaRoutingCode: "", swiftRouteBICNumber: "", reasionOfTransfer: "", documents: null },
    verifyData: null, isBtnLoading: false, reviewDetailsLoading: false,
    isShowGreyButton: false,
    permissions: {},
    isSuccess:false,
  }
  componentDidMount() {
    getFeaturePermissionsByKeyName(`send_fiat`);
    this.permissionsInterval = setInterval(this.loadPermissions, 200);
    if (!this.props.walletCode) {
      this.fetchMemberWallet();
    }
   
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
    this.setState({ ...this.state, isBtnLoading: true ,errorMessage:null})
    if (this.state.verifyData?.verifyData) {
        if (this.state.verifyData.verifyData.isPhoneVerified) {
            if (!this.state.verifyData.isPhoneVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify phone verification code"
                });
                this.reviewScrool.current.scrollIntoView();
                return;
            }
        }
        if (this.state.verifyData.verifyData.isEmailVerification) {
            if (!this.state.verifyData.isEmailVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify  email verification code"
                });
                this.reviewScrool.current.scrollIntoView();
                return;
            }
        }
        if (this.state.verifyData.verifyData.twoFactorEnabled) {
            if (!this.state.verifyData.isAuthenticatorVerification) {
                this.setState({
                    ...this.state,
                    errorMessage: "Please verify authenticator code"
                });
                this.reviewScrool.current.scrollIntoView();
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
            this.reviewScrool.current.scrollIntoView();
            return
        }
    }
    if (this.state.reviewDetails) {
        let obj = Object.assign({}, this.state.reviewDetails);
        obj["accountNumber"] = obj.accountNumber ? apicalls.encryptValue(obj.accountNumber, this.props.userProfile?.sk) : null;
        obj["bankName"] = obj.bankName ? apicalls.encryptValue(obj.bankName, this.props.userProfile?.sk) : null;
        obj["bankAddress"] = obj.bankAddress ? apicalls.encryptValue(obj.bankAddress, this.props.userProfile?.sk) : null;
        obj["beneficiaryAccountName"] = obj.beneficiaryAccountName ? apicalls.encryptValue(obj.beneficiaryAccountName, this.props.userProfile?.sk) : null;
        obj["beneficiaryAccountAddress"] = obj.beneficiaryAccountAddress ? apicalls.encryptValue(obj.beneficiaryAccountAddress, this.props.userProfile?.sk) : null;
        obj["routingNumber"] = obj.routingNumber ? apicalls.encryptValue(obj.routingNumber, this.props.userProfile?.sk) : null;
        obj["originalAmount"] = obj.requestedAmount ? obj.requestedAmount : 0;
      const saveRes = await saveWithdraw(obj)
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
        this.reviewScrool.current.scrollIntoView();
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
                                    <div className="summary-liststyle">How much you will receive</div>
                    <div className="summarybal">
                    <NumberFormat
                                            value={`${(this.state.reviewDetails?.requestedAmount - this.state.reviewDetails?.comission)}`}
                                            thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                
                <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Total fees</div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.comission)}`}
                                        thousandSeparator={true} displayType={"text"} decimalScale={2} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                
                <div className="pay-list" style={{ alignItems: 'baseline' }}>
                                    <div className="summary-liststyle">Withdrawal amount</div>
                                    <div className="summarybal"><NumberFormat
                                        value={`${(this.state.reviewDetails?.requestedAmount)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</div>
                  </div>
                

                  </div>
                 
                                <div className="d-flex  justify-content">
                                    <div className="adbook-head">Recipient details</div>
                  </div>
                  <div className="cust-summary-new kpi-List sendfiat-summarystyle">
                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Whitelist Name </div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.favouriteName}</Text></div>
                  </div>
               
                {this.state.reviewDetails?.name &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Beneficiary Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.name}</Text></div>
                                </div>
                           }
                {this.state.reviewDetails?.firstName && 
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">First Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.firstName}</Text></div>
                                </div>
                          }
                {this.state.reviewDetails?.lastName && 
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Last Name</div>
                                   <div> <Text className="kpi-val">{this.state.reviewDetails?.lastName}</Text></div>
                                </div>
                           }
                 {this.state.reviewDetails?.iban &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">IBAN </div>
                                    <div> <Text className="kpi-val">{this.state.reviewDetails?.iban}</Text></div>
                                </div>
                           }
               {this.state.reviewDetails?.customerRemarks &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Reason For Transfer </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.customerRemarks || "-"}</Text></div>
                                </div>
                          }

{this.state.reviewDetails?.abaRoutingCode &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">ABA Routing code</div>
                                    <div> <Text className="kpi-val">{this.state.reviewDetails?.abaRoutingCode || "-"}</Text></div>
                                </div>
    }
                {this.state.reviewDetails?.swiftRouteBICNumber &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">SWIFT / BIC Code</div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.swiftRouteBICNumber || "-"}</Text></div>
                                </div>
                            }
                {this.state.reviewDetails?.accountNumber &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Account Number </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.accountNumber || "-"}</Text></div>
                                </div>
                           }
                           {this.state.reviewDetails?.ukShortCode &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Uk Sort Code  </div>
                                    <div>  <Text className="kpi-val">{this.state.reviewDetails?.ukShortCode || "-"}</Text></div>
                                </div>
                           }
                {this.state.reviewDetails?.bankName &&
                                <div className="kpi-divstyle" >
                                    <div className="kpi-label">Bank Name </div>
                                    <div>  <Text className="kpi-val">{this.state?.reviewDetails?.bankName || "-"}</Text></div>
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
   { isSuccess && <DelcarationForm back={this.props?.back}/>}
</React.Fragment>
  }
}
const connectStateToProps = ({ sendReceive, userConfig, menuItems, oidc }) => {
  return {
    sendReceive,
    userProfile: userConfig?.userProfileInfo,
    trackAuditLogData: userConfig?.trackAuditLogData,
    withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,
    oidc: oidc?.user?.profile
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
  
      changeStep: (stepcode) => {
          dispatch(setStep(stepcode))
      },
      amountReset: () => {
          dispatch(setClearAmount())
      },

    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CustomerTransferSummary));