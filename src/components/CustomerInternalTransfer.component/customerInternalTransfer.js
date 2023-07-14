import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, Alert } from 'antd';
import apicalls from "../../api/apiCalls";

import NumberFormat from "react-number-format";
import { validateAmount } from "../personalInternalTransfer.component/api";
import {getCustomerDeails} from './api';
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import { getVerificationFields } from "../onthego.transfer/verification.component/api"
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
import {hideSendCrypto,setClearAmount} from '../../reducers/sendreceiveReducer'
import { setStep } from '../../reducers/buysellReducer';
// import CustomerTransferSummary from "./customerInternalTransferPreview";

const { Text,Paragraph } = Typography; 
class CustomerTransfer extends Component {
  enteramtForm = React.createRef();
 useDivRef = React.createRef(null);
  state = {
    step: this.props.selectedCurrency ? "enteramount" : "selectcurrency",
    filterObj: [],
    selectedCurrency: this.props.selectedCurrency,
        isNewTransfer: false,
        amount: "",
    onTheGoObj: { amount: '', description: '' },
    reviewDetails: {},
    payees: [],
    payeesLoading: true,
    errorMessage: null,
    codeDetails: { abaRoutingCode: "", swiftRouteBICNumber: "", reasionOfTransfer: "", documents: null }, isBtnLoading: false, reviewDetailsLoading: false,
    isVerificationEnable: true,
    isVarificationLoader: true,
    fiatWallets: [],
    isShowGreyButton: false,
    permissions: {},
    isPersonalSummary:false,
    isPersonal:true,
    customerDetails:{},
    enterCustomerId:null,
    isShowCustomerDetails:false,
    validIban:false,
    customerIdErrorMessage:null,
    isShowValid:false,
    ibanLoading:false,
    isValidateLoading:false
  }
  componentDidMount() {
    console.log(this.props.walletCode);
    this.verificationCheck()
    getFeaturePermissionsByKeyName(`send_fiat`);
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

  verificationCheck = async () => {
    this.setState({ ...this.state, isVarificationLoader: true })
    const verfResponse = await getVerificationFields();
    let minVerifications = 0;
    if (verfResponse.ok) {
      for (let verifMethod in verfResponse.data) {
        if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
            minVerifications = minVerifications + 1;
        }
      }
      if (minVerifications >= 1) {
        this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: true })
            } else {
                this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: false })
      }
    } else {
        this.setState({ ...this.state, isVarificationLoader: false, errorMessage: apicalls.isErrorDispaly(verfResponse) })
    }
  }
  chnageStep = (step, values) => {
    this.setState({ ...this.state, step, onTheGoObj: values });
    if (step === 'newtransfer') {
      this.props.dispatch(hideSendCrypto(false));
        this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
    }
}
amountnext = (values) => {
    let _amt = values.amount;
    _amt = _amt.replace(/,/g, "");
    if (_amt > 0) {
        this.setState({ ...this.state, amount: _amt }, () => this.validateAmt(_amt, "newtransfer", values, "newtransferLoader",))
    } else {
        if (!_amt) {
            this.setState({ ...this.state, errorMessage: '' });
        } else {
            this.setState({ ...this.state, errorMessage: 'Amount must be greater than zero' });
        }
    }
}
 getCustomerDeails = async (e,isValid) => {
this.setState({...this.state,enterCustomerId:e,customerDetails:{},customerIdErrorMessage:null,isShowValid:false})
    if(e?.length>=10&&isValid){
        this.setState({...this.state,validIban:true})
        isValid ? this.setState({...this.state,ibanLoading:true}) : this.setState({...this.state,ibanLoading:false});
        const response = await getCustomerDeails(e);
        if (response.ok) {
            if(isValid&&response.data && (response.data?.routingNumber || response.data?.bankName)){
                this.setState({...this.state,customerDetails:response.data,isShowCustomerDetails:true,validIban:true,isValidateLoading:false})
            }else{
                this.setState({...this.state,validIban:false,ibanLoading:false,isValidateLoading:false})
                if (this.state.customerDetails) {
                    this.setState({...this.state,customerDetails:{},isShowCustomerDetails:false,customerIdErrorMessage:"No bank details are available for this IBAN number",ibanLoading:false})
                    this.useDivRef.current.scrollIntoView(0,0);
                    return;
                }
            }
        }else{
            this.setState({...this.state,customerDetails:{},validIban:false,customerIdErrorMessage:apicalls.isErrorDispaly(response),ibanLoading:false,isValidateLoading:false})
        }
    }
    if(e?.length>=10&&!isValid) {
        this.setState({...this.state,customerIdErrorMessage:false,isValidateLoading:false});
    } 
}
onCustomerValidate = (e) => {
    debugger
    this.setState({...this.state,isShowCustomerDetails:false,validIban:true,isValidateLoading:true});
    if (e?.length >= 10) {
        if (e &&!/^[A-Za-z0-9]+$/.test(e)) {
            this.setState({...this.state,customerDetails:{},isShowCustomerDetails:false,isShowValid:true})
            this.enteramtForm.current?.validateFields(["customerId"], this.validateCustomerId)
        }
        else {
            this.setState({...this.state,isShowValid:false})
            this.getCustomerDeails(e, "true");
        }
    }
    else {
        this.setState({...this.state,customerDetails:{},isShowCustomerDetails:false,validIban:false,isShowValid:true})
        this.enteramtForm?.current.validateFields(["customerId"], this.validateCustomerId)
    }
}

 validateCustomerId = (_, value) => {
    this.setState({...this.state,isValidateLoading:false})
    if ((!value&&this.state.isShowValid)||!value) {
        this.setState({...this.state,isShowCustomerDetails:false})
        return Promise.reject(apicalls.convertLocalLang("is_required"));
    } else if ((!this.state.validIban&&this.state.isShowValid) || value?.length < 10) {
        this.setState({...this.state,customerDetails:{},isShowCustomerDetails:false})
        return Promise.reject("Please enter correct Customer ID to proceed");
    } else if (
        (value && this.state.isShowValid)&&
        !/^[A-Za-z0-9]+$/.test(value)
    ) {
        this.setState({...this.state,customerDetails:{},isShowCustomerDetails:false})
        return Promise.reject(
            "Please enter correct Customer ID to proceed"
        );
    }
    else {
        return Promise.resolve();
    }
};
  validateAmt = async (amt, step, values, loader) => {
    
    const {isShowCustomerDetails}=this.state;
    if (Object.hasOwn(values, 'customerId')) {
        if ((!isShowCustomerDetails || Object.keys(isShowCustomerDetails).length === 0)) {
            this.setState({ ...this.state, [loader]: false, errorMessage: "Please click validate button before saving" });
            this.useDivRef?.current?.scrollIntoView(0,0);
            return;
        }
    } 
    let FixedAmountVal=parseFloat(amt?.replace(/,/g, ''));
    this.setState({ ...this.state, [loader]: true, errorMessage: null });
    const res = await validateAmount(FixedAmountVal.toFixed(2),this.props.walletCode?.walletCode);
    if (res.ok) {
        this.setState({ ...this.state, [loader]: false, errorMessage: null,isPersonalSummary:true,isPersonal:false,reviewDetails:res.data }, () => this.chnageStep(step, values,));

    } else {
        this.setState({ ...this.state, [loader]: false, errorMessage: apicalls.isErrorDispaly(res) })
    }

  }
   goBack = async () => {
    this.setState({ ...this.state, isPersonalSummary: false,isPersonal:true,isVarificationLoader:false});
}

  keyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.goToAddressBook()
    }
  }
  goToAddressBook = () => {
    let _amt = this.enteramtForm.current.getFieldsValue().amount
    _amt = _amt.replace(/,/g, '')
    if (_amt > 0) {
      this.setState(
        {
          ...this.state,
          isNewTransfer: false,
          amount: _amt,
          onTheGoObj: this.enteramtForm.current.getFieldsValue(),
        },
        () => {
          this.enteramtForm.current
            .validateFields()
            .then(() =>
              this.validateAmt(
                _amt,
                'addressselection',
                this.enteramtForm.current.getFieldsValue(),
                'addressLoader',
              ),
            )
        },
      )
    } else {
      if (!_amt) {
        this.enteramtForm.current.validateFields()
      } else {
        this.setState({
          ...this.state,
          errorMessage: 'Amount must be greater than zero',
        })
      }
    }
  }


  render() {
    const {  isVarificationLoader, isVerificationEnable,isPersonalSummary ,isPersonal,reviewDetails,enterCustomerId,useDivRef} = this.state;
    return <React.Fragment>
{isPersonal && <>

          {isVarificationLoader && <Loader />}
          {!isVarificationLoader && (<>
             <div className="text-center sell-title-styels">
             <Translate
                        content={"tab_InternalCustomerTransfer"}
                            component={Paragraph}
                            className="drawer-maintitle"
                        />
                        </div>
                        <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <div className="summarybal total-amount">
                      {this.props.walletCode.walletCode} {" "}
                        <NumberFormat
                          decimalScale={2}
                          placeholder={"Enter Amount"}
                          thousandSeparator={true} displayType={"text"}
                          disabled
                          value={this.props.walletCode.amount}
                        />
                      </div>
                    </Col>
                    </Row>      
            <Form
              autoComplete="off"
              initialValues={{ amount: "",enterCustomerId:null }}
              ref={this.enteramtForm}
              onFinish={this.amountnext}
              scrollToFirstError
            >
                <div ref={useDivRef}></div>
              {!isVerificationEnable && (
                  <Alert 
                  message="Verification alert !"
                  description={<Text>Without verifications you can't send. Please select send verifications from <Link onClick={() => {
                      this.props.history.push("/userprofile/2");
                      if (this.props?.onClosePopup) {
                          this.props?.onClosePopup();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
              {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
              {isVerificationEnable && (
                <>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label fund-transfer-input send-fiat-input"
                        name="amount"
                        label={"Enter Amount"}
                        required
                        rules={[
                          {
                            required: true,
                            message: 'Is required',
                          },
                          {
                            validator: (_, value) => {
                              const reg = /.*[0-9].*/g;
                              if (value && !reg.test(value)) {
                                return Promise.reject("Invalid amount");
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        <NumberFormat
                          customInput={Input}
                          className="cust-input cust-select-arrow tfunds-inputgroup"
                          placeholder={"Enter Amount"}
                          maxLength="13"
                          decimalScale={2}
                          displayType="input"
                          allowNegative={false}
                          thousandSeparator={","}
                          onKeyDown={this.keyDownHandler}
                          onValueChange={() => {
                            this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount, errorMessage: '' })
                        }}
                        />

                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                className="custom-forminput custom-label "
                name="customerId"
                required
                rules={[
                    {
                        validator: this.validateCustomerId,
                      },
                ]}
                label='Customer ID'
                onChange={(e) => {
                    this.getCustomerDeails(e.target.value)
                }}
            >
                <Input
                    className="cust-input ibanborder-field"
                    placeholder='Customer ID'
                    maxLength={10}
                    addonAfter={ <Button className={``}
                    type="primary"
                        loading={this.state.isValidateLoading}
                        onClick={() => this.onCustomerValidate(enterCustomerId)}
                         >
                        <Translate content="validate" />
                    </Button>     }
                    />                      
            </Form.Item>
            </Col>     
                  </Row>
                  <Row gutter={[16, 4]} className="send-drawerbtn" >
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mobile-viewbtns mobile-btn-pd">
                  <Form.Item className="">
                    <Button block
                      htmlType="submit"
                      size="large"
                      className="pop-btn"
                      loading={this.state.newtransferLoader}
                    >
                       Transfer
                    </Button>
                  </Form.Item>
                </Col>
                  </Row>
                </>
              )}
            </Form>
            </>
          )}
        </>}
        {/* {isPersonalSummary && <CustomerTransferSummary back={this.goBack} walletCode={this.props?.walletCode} reviewDetails={reviewDetails} onClose={this.props?.onClose}/>} */}
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CustomerTransfer));