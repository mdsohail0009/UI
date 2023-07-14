import React, {useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Alert,Spin } from 'antd';
import apicalls from "../../api/apiCalls";

import NumberFormat from "react-number-format";
import {getCustomerDeail,internalCustomerTransfer} from './api';
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import { getVerificationFields } from "../onthego.transfer/verification.component/api"
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
import {hideSendCrypto,setClearAmount} from '../../reducers/sendreceiveReducer'
import { setStep } from '../../reducers/buysellReducer';
import AddressDocumnet from '../addressbook.component/document.upload';
import CustomerTransferSummary from "./customerInternalTransferPreview";

const { Text,Paragraph } = Typography; 
const CustomerTransfer =(props)=> {
const  enteramtForm = React.useRef();
const useDivRef = React.useRef(null);
 const [state,setState ]= useState({
    step: props.selectedCurrency ? "enteramount" : "selectcurrency",
    filterObj: [],
    selectedCurrency: props.selectedCurrency,
        isNewTransfer: false,
        amount: "",
    onTheGoObj: { amount: '', description: '' },
    reviewDetails: {},
    errorMessage: null,
    isBtnLoading: false, reviewDetailsLoading: false,
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
    isValidateLoading:false,
    documents:null,
    newtransferLoader:false
  })
  useEffect(()=>{
    verificationCheck()
    // getFeaturePermissionsByKeyName(`send_fiat`);
    // permissionsInterval = setInterval(loadPermissions, 200);
  },[])
//   const loadPermissions = () => {
//     if (props.withdrawCryptoPermissions) {
//       clearInterval(permissionsInterval);
//       let _permissions = {};
//       for (let action of props.withdrawCryptoPermissions?.actions) {
//         _permissions[action.permissionName] = action.values;
//       }
//       setState({ ...state, permissions: _permissions });
//     }
//   }

 const verificationCheck = async () => {
    setState({ ...state, isVarificationLoader: true })
    const verfResponse = await getVerificationFields();
    let minVerifications = 0;
    if (verfResponse.ok) {
      for (let verifMethod in verfResponse.data) {
        if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
            minVerifications = minVerifications + 1;
        }
      }
      if (minVerifications >= 1) {
        setState({ ...state, isVarificationLoader: false, isVerificationEnable: true })
            } else {
                setState({ ...state, isVarificationLoader: false, isVerificationEnable: false })
      }
    } else {
        setState({ ...state, isVarificationLoader: false, errorMessage: apicalls.isErrorDispaly(verfResponse) })
    }
  }

 const getCustomerDeails = async (e,isValid) => {
setState({...state,enterCustomerId:e,customerDetails:{},customerIdErrorMessage:null,isShowValid:false,errorMessage:null})
    if(e?.length>=10&&isValid){
        setState({...state,validIban:true})
        isValid ? setState({...state,ibanLoading:true}) : setState({...state,ibanLoading:false});
        const response = await getCustomerDeail(e);
        if (response.ok) {
            if(isValid&&response.data &&response.data?.fullName){
                setState({...state,customerDetails:response.data,isShowCustomerDetails:true,validIban:true,isValidateLoading:false})
            }else{
                setState({...state,validIban:false,ibanLoading:false,isValidateLoading:false})
                if (state.customerDetails) {
                    setState({...state,customerDetails:{},isShowCustomerDetails:false,customerIdErrorMessage:"No bank details are available for this IBAN number",ibanLoading:false})
                    useDivRef?.current?.scrollIntoView(0,0);
                    return;
                }
            }
        }else{
            setState({...state,customerDetails:{},validIban:false,errorMessage:apicalls.isErrorDispaly(response),ibanLoading:false,isValidateLoading:false})
        }
    }
    if(e?.length>=10&&!isValid) {
        setState({...state,customerIdErrorMessage:false,isValidateLoading:false});
    } 
}
 const onCustomerValidate = () => {
    let customerId = enteramtForm.current.getFieldsValue().customerId;
    setState({...state,isShowCustomerDetails:false,validIban:true,isValidateLoading:true});
    if (customerId?.length >= 10) {
        if (customerId &&!/^[A-Za-z0-9]+$/.test(customerId)) {
            setState({...state,customerDetails:{},isShowCustomerDetails:false,isShowValid:true})
            enteramtForm.current?.validateFields(["customerId"], validateCustomerId)
        }
        else {
            setState({...state,isShowValid:false})
            getCustomerDeails(customerId, "true");
        }
    }
    else {
        setState({...state,customerDetails:{},isShowCustomerDetails:false,validIban:false,isShowValid:true})
        enteramtForm?.current.validateFields(["customerId"], validateCustomerId)
    }
}

 const validateCustomerId = (_, value) => {
    setState({...state,isValidateLoading:false})
    if ((!value&&state.isShowValid)||!value) {
        setState({...state,isShowCustomerDetails:false})
        return Promise.reject(apicalls.convertLocalLang("is_required"));
    } else if ((!state.validIban&&state.isShowValid) || value?.length < 10) {
        setState({...state,customerDetails:{},isShowCustomerDetails:false})
        return Promise.reject("Please enter valid Customer ID");
    } else if (
        (value && state.isShowValid)&&
        !/^[A-Za-z0-9]+$/.test(value)
    ) {
        setState({...state,customerDetails:{},isShowCustomerDetails:false})
        return Promise.reject(
            "Please enter valid Customer ID"
        );
    }
    else {
        return Promise.resolve();
    }
};
 const amountnext = async (values) => {
    const {customerDetails}=state;
    if(values.amount==="0" || values.amount==='0'){
        setState({ ...state, newtransferLoader: false, errorMessage: "Amount must be greater than zero." });
        useDivRef?.current?.scrollIntoView(0,0);
        return;
    }
   else if (Object.hasOwn(values, 'customerId')) {
        if ((!customerDetails || Object.keys(customerDetails).length === 0)) {
            setState({ ...state, newtransferLoader: false, errorMessage: "Please click the validate button to retrieve customer details." });
            useDivRef?.current?.scrollIntoView(0,0);
            return;
        }
    }
    let FixedAmountVal=parseFloat(values.amount?.replace(/,/g, ''));
    let obj={
        "ReceiverCustomerId": state.customerDetails.receiversCustomerId,
        "Amount":FixedAmountVal.toFixed(2),
        "MemberWalletId": props.walletCode?.walletId,
        "WalletCode": props.walletCode?.walletCode,
        "Documents":state.documents

    }
    setState({ ...state, newtransferLoader: true, errorMessage: null });
    const res = await internalCustomerTransfer(obj);
    if (res.ok) {
        setState({ ...state, newtransferLoader: false, errorMessage: null,isPersonalSummary:true,isPersonal:false,reviewDetails:res.data })

    } else {
        setState({ ...state, newtransferLoader: false, errorMessage: apicalls.isErrorDispaly(res) })
    }


  }
  const goBack = async () => {
    setState({ ...state, isPersonalSummary: false,isPersonal:true,isVarificationLoader:false});
}

 const keyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }



    return <React.Fragment>
{state.isPersonal && <>
          {state.isVarificationLoader && <Loader />}
          {!state.isVarificationLoader && (<>
             <div className="text-center sell-title-styels">
             <Translate
                        content={"tab_InternalCustomerTransfer"}
                            component={Paragraph}
                            className="drawer-maintitle"
                        />
                        </div>
                       {state.isVerificationEnable&& <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <div className="summarybal total-amount">
                      {props.walletCode.walletCode} {" "}
                        <NumberFormat
                          decimalScale={2}
                          placeholder={"Enter Amount"}
                          thousandSeparator={true} displayType={"text"}
                          disabled
                          value={props.walletCode.amount}
                        />
                      </div>
                    </Col>
                    </Row>      }
            <Form
              autoComplete="off"
              initialValues={{ amount: "",enterCustomerId:null }}
              ref={enteramtForm}
              onFinish={amountnext}
              scrollToFirstError
            >
                <div ref={useDivRef}></div>
              {!state.isVerificationEnable && (
                  <Alert 
                  message="Verification alert !"
                  description={<Text>Without verifications you can't send. Please select send verifications from <Link onClick={() => {
                      props.history.push("/userprofile/2");
                      if (props?.onClosePopup) {
                          props?.onClosePopup();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
              {state.errorMessage && <Alert type="error" description={state.errorMessage} showIcon />}
              {state.isVerificationEnable && (
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
                          onKeyDown={keyDownHandler}
                          onValueChange={() => {
                            setState({ ...state, amount: enteramtForm.current?.getFieldsValue().amount, errorMessage: '' })
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
                        validator: validateCustomerId,
                      },
                ]}
                label='Customer ID'
                onChange={(e) => {
                    getCustomerDeails(e.target.value)
                }}
            >
                <Input
                    className="cust-input ibanborder-field"
                    placeholder='Customer ID'
                    maxLength={10}
                    addonAfter={ <Button className={``}
                    type="primary"
                        loading={state.isValidateLoading}
                        onClick={() => onCustomerValidate()}
                         >
                        <Translate content="validate" />
                    </Button>     }
                    />                      
            </Form.Item>
            </Col> 
                                <div className="box basic-info alert-info-custom mt-16 kpi-List" style={{width:'100%'}}>
                                    <Spin spinning={state.ibanLoading}>
                                        {state.validIban && state.isShowCustomerDetails &&
                                            <><Row>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label">
                                                            Personal/Business Name
                                                        </label>
                                                        <div class><Text className="kpi-val">{(state.customerDetails?.fullName !== '' && state.customerDetails?.fullName !== null) ? state.customerDetails?.fullName : '-'}</Text></div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label ">Email Address</label>
                                                        <div class><Text className="kpi-val">{(state.customerDetails?.email !== '' && state.customerDetails?.email !== null) ? state.customerDetails?.email : '-'}</Text></div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label ">Phone Number</label>
                                                        <div class><Text className="kpi-val">{(state.customerDetails?.phoneNumber !== '' && state.customerDetails?.phoneNumber !== null) ? state.customerDetails?.phoneNumber : '-'}</Text></div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            </>}
                                            {(!state.validIban || !state.isShowCustomerDetails) &&    
                                           <div>
                                            <span className="info-details">No customer details available</span>
                                           </div>
                                      }
                                    </Spin>
                                </div>
                                {state.validIban && state.isShowCustomerDetails && <Col>
                                    <React.Fragment>
                                        <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                                        <AddressDocumnet
                                            documents={state?.documents} editDocument={false}
                                            onDocumentsChange={(docs) => {
                                                setState({ ...state, documents: docs })
                                            }} refreshData={"customer"} type={"reasonPayee"} />
                                    </React.Fragment></Col>}
                  </Row>
                  <Row gutter={[16, 4]} className="send-drawerbtn" >
                  <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mobile-viewbtns mobile-btn-pd">
                  <Form.Item className="">
                    <Button block
                      htmlType="submit"
                      size="large"
                      className="pop-btn"
                      loading={state.newtransferLoader}
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
        {state.isPersonalSummary && <CustomerTransferSummary back={goBack} walletCode={props?.walletCode} reviewDetails={state.reviewDetails} onClose={props?.onClose}/>}
</React.Fragment>
  
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