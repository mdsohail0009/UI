import React, {useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Alert,Spin,Image,List,Empty } from 'antd';
import apicalls from "../../api/apiCalls";
import Search from "antd/lib/input/Search";
import NumberFormat from "react-number-format";
import {getCustomerDeail,internalCustomerTransfer} from './api';
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import { getVerificationFields } from "../onthego.transfer/verification.component/api"
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
import { getAccountWallet} from "../../api/apiServer";
import AddressDocumnet from '../addressbook.component/document.upload';
import CustomerTransferSummary from "./customerInternalTransferPreview";
import {setSelectedWallet,setSummaryDetails} from '../../reducers/internalCustomerTransfer';

const { Text,Paragraph } = Typography; 
const CustomerTransfer =(props)=> {
  let permissionsInterval;
const  enteramtForm = React.useRef();
const useDivRef = React.useRef(null);
 const [state,setState ]= useState({
    filterObj: [],
    isVerificationEnable: true,
    isVarificationLoader: true,
    fiatWallets: [],
    filtercoinsList:[],
    isShowGreyButton: false,
    permissions: {},
    enterCustomerId:null,
    isShowCustomerDetails:false,
    validIban:false,
    customerIdErrorMessage:null,
    isShowValid:false,
    ibanLoading:false,
    isValidateLoading:false,
    documents:null,
    newtransferLoader:false,
    searchFiatVal: "",
    selectedCurrency:{},
  })
  const [fiatWalletsLoading,setFiatWalletsLoading]=useState(false);
  const [isPersonalSummary,setIsPersonalSummary]=useState(false);
  const [step,setStep]=useState(props?.isWallet ? "selectcurrency":"enteramount")
  const [customerDetails,setCustomerDetails]=useState(null);
  const [errorMessage,setErrorMessage]=useState(null);
  useEffect(()=>{
    if(props?.isWallet){
      getAccountWallets();
    }else{
      props.dispatch(setSelectedWallet(props?.walletCode));
      verificationCheck(null);
    }

    getFeaturePermissionsByKeyName(`send_fiat`);
    permissionsInterval = setInterval(loadPermissions, 200);
  },[])
  const loadPermissions = () => {
    if (props.withdrawCryptoPermissions) {
      clearInterval(permissionsInterval);
      let _permissions = {};
      for (let action of props.withdrawCryptoPermissions?.actions) {
        _permissions[action.permissionName] = action.values;
      }
      setState({ ...state, permissions: _permissions });
    }
  }
const getAccountWallets=async()=>{
  setFiatWalletsLoading(true)
  let walletObj=await getAccountWallet();
  if(walletObj.ok){
    setState({ ...state, fiatWallets:walletObj.data,filtercoinsList: walletObj.data});
    setErrorMessage(null)
    setCustomerDetails(null);
    setFiatWalletsLoading(false)
  }
  else{
       setState({ ...state,fiatWalletsLoading:false, fiatWallets:[]});
       setErrorMessage(apicalls.isErrorDispaly(walletObj))
       setFiatWalletsLoading(false)
  
  }
}
const handleFiatSearch = ({ target: { value: val } }) => {
  if (val) {
      const fiatWallets = state.filtercoinsList?.filter(item => item.currencyCode.toLowerCase().includes(val.toLowerCase()));
      setState({ ...state, fiatWallets, searchFiatVal: val });
  }
  else
      setState({ ...state, fiatWallets: state.filtercoinsList, searchFiatVal: val });
}
const selectsCurrency=(item)=>{
    if (item.avilable) {
      verificationCheck(item);
     props.dispatch(setSelectedWallet(item));
    }
    else {
      setErrorMessage("Insufficient balance");
      useDivRef?.current?.scrollIntoView(0,0);
    }
  
}
const changeSteps = (step,values,flag) => {
  setErrorMessage(null);
  setStep(step);
  if (step === 'enteramount') {
      setState({ ...state,isVarificationLoader:false,selectedCurrency:values,isVerificationEnable:flag?true:false  });
      setFiatWalletsLoading(false);
      setIsPersonalSummary(false);
  }else  if (step === 'selectcurrency') {
    setState({ ...state,isVarificationLoader:false,selectedCurrency:values,isVerificationEnable:flag?true:false  });
    setFiatWalletsLoading(false);
    setIsPersonalSummary(false);
}else {
    setState({ ...state,isVarificationLoader:false,isVerificationEnable:false  });
    setIsPersonalSummary(true);
    setFiatWalletsLoading(false);
  }

}
 const verificationCheck = async (values) => {
  setErrorMessage(null);
    setState({ ...state, isVarificationLoader: true })
    const verfResponse = await getVerificationFields();
    let minVerifications = 0;
    if (verfResponse.ok) {
      for (let verifMethod in verfResponse.data) {
        if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
            minVerifications = minVerifications + Number(process.env.REACT_APP_SUISSEBASE_MIN_VERIFICATIONS);
        }
      }
      if (minVerifications >= Number(process.env.REACT_APP_SUISSEBASE_MIN_VERIFICATIONS)) {
        setState({ ...state, isVarificationLoader: false, isVerificationEnable: true})
          changeSteps('enteramount',values,true);
            } else {
                setState({ ...state, isVarificationLoader: false, isVerificationEnable: false })
                if(props?.isWallet){
                  changeSteps('enteramount',values,false);
                }
      }
    } else {
        setState({ ...state, isVarificationLoader: false, errorMessage: apicalls.isErrorDispaly(verfResponse) })
    }
  }

  const getCustomerDeails = async (e, isValid) => {
    setState({ ...state, enterCustomerId: e, customerIdErrorMessage: null, isShowValid: false, documents: null })
    setErrorMessage(null);
    setCustomerDetails(null);
    if (e?.length >= 10 && isValid) {
      setState({ ...state, validIban: true })
      isValid ? setState({ ...state, ibanLoading: true }) : setState({ ...state, ibanLoading: false });
      const response = await getCustomerDeail(e);
      if (response.ok) {
        if (isValid && response.data && response.data?.fullName) {
          setState({ ...state, isShowCustomerDetails: true, validIban: true, isValidateLoading: false, ibanLoading: false,documents: null })
          setCustomerDetails(response.data);
        } else {
          setState({ ...state, validIban: false, ibanLoading: false, isValidateLoading: false })
          if (customerDetails) {
            setState({ ...state, isShowCustomerDetails: false, customerIdErrorMessage: "No bank details are available for this IBAN number", ibanLoading: false,documents: null })
            setCustomerDetails(null);
            useDivRef?.current?.scrollIntoView(0, 0);
            return;
          }
        }
      } else {
        setCustomerDetails(null);
        setState({ ...state, validIban: false, ibanLoading: false, isValidateLoading: false })
        setErrorMessage(apicalls.isErrorDispaly(response));
        useDivRef?.current?.scrollIntoView(0, 0);
      }
    }
    if (e?.length >= 10 && !isValid) {
      setState({ ...state, customerIdErrorMessage: false, isValidateLoading: false });
    }
  }
  const onCustomerValidate = () => {
    let customerId = enteramtForm.current.getFieldsValue().customerId;
    setState({ ...state, isShowCustomerDetails: false, validIban: true, isValidateLoading: true });
    if (customerId?.length >= 10) {
      if (customerId && !/^[A-Za-z0-9]+$/.test(customerId)) {
        setCustomerDetails(null);
        setState({ ...state, isShowCustomerDetails: false, isShowValid: true })
        enteramtForm.current?.validateFields(["customerId"], validateCustomerId)
      }
      else {
        setState({ ...state, isShowValid: false })
        getCustomerDeails(customerId, "true");
      }
    }
    else {
      setCustomerDetails(null);
      setState({ ...state, isShowCustomerDetails: false, validIban: false, isShowValid: true })
      enteramtForm?.current.validateFields(["customerId"], validateCustomerId)
    }
  }

 const validateCustomerId = (_, value) => {
    setState({...state,isValidateLoading:false})
    if ((!value&&state.isShowValid)||!value) {
        setState({...state,isShowCustomerDetails:false})
        return Promise.reject(apicalls.convertLocalLang("is_required"));
    } else if ((!state.validIban&&state.isShowValid) || value?.length < 10) {
      setCustomerDetails(null);
        setState({...state,isShowCustomerDetails:false})
        return Promise.reject("Please enter valid Customer ID");
    } else if (
        (value && state.isShowValid)&&
        !/^[A-Za-z0-9]+$/.test(value)
    ) {
      setCustomerDetails(null);
        setState({...state,isShowCustomerDetails:false})
        return Promise.reject(
            "Please enter valid Customer ID"
        );
    }
    else {
        return Promise.resolve();
    }
};
 const amountnext = async (values) => {
    if(values.amount==="0" || values.amount==='0'){
        setState({ ...state, newtransferLoader: false
         });
         setErrorMessage( "Amount must be greater than zero.")
        useDivRef?.current?.scrollIntoView(0,0);
        return;
    }
   else if (Object.hasOwn(values, 'customerId')) {
        if ((!customerDetails || Object.keys(customerDetails).length === 0)) {
            setState({ ...state, newtransferLoader: false});
            setErrorMessage("Please click the validate button to retrieve customer details.")
            useDivRef?.current?.scrollIntoView(0,0);
            return;
        }
    }
    let FixedAmountVal=parseFloat(values.amount?.replace(/,/g, ''));
    let obj={
        "ReceiverCustomerId": customerDetails.receiversCustomerId,
        "Amount":FixedAmountVal.toFixed(2),
        "MemberWalletId":state?.selectedCurrency?.id?state?.selectedCurrency.id: props.walletCode?.walletId ,
        "WalletCode":!state?.selectedCurrency?.currencyCode ? props.walletCode?.walletCode : state?.selectedCurrency?.currencyCode,
        "docRepositories":state.documents,
        "CreatedBy":props.userProfile?.userName,
    }
    obj.info=JSON.stringify(props?.trackAuditLogData);
    setState({ ...state, newtransferLoader: true});
    setErrorMessage(null);
    const res = await internalCustomerTransfer(obj);
    if (res.ok) {
        setState({ ...state, newtransferLoader: false,})
        setErrorMessage(null);
        setIsPersonalSummary(true);
        props.dispatch(setSummaryDetails(res.data));

    } else {
        setState({ ...state, newtransferLoader: false})
        setErrorMessage(apicalls.isErrorDispaly(res));
        useDivRef?.current?.scrollIntoView(0,0);
        return;
    }


  }
  const goBack = async () => {
    setState({ ...state,isVarificationLoader:false,documents:null});
    setCustomerDetails(null);
    setIsPersonalSummary(false);
    props.dispatch(setSelectedWallet(null));
      changeSteps('selectcurrency', null,true);
        getAccountWallets();
}

 const keyDownHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }


 const renderStep = () => {
    const steps = {
      selectcurrency: (
        <React.Fragment>
          <div ref={useDivRef}></div>
            <div>
              <div className="text-center sell-title-styels">
             <Translate
                        content={"tab_InternalCustomerTransfer"}
                            component={Paragraph}
                            className="drawer-maintitle"
                        />
                        </div>
                        {fiatWalletsLoading &&state.fiatWallets?.length===0 && <Loader />}
          {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                        {!(fiatWalletsLoading&& state.fiatWallets?.length==0 )   && (<>
              <div className="mt-8">
              <div
                 className='label-style'>Send from your SuisseBase FIAT Wallet</div>
              </div>
            
              <Search placeholder="Search Currency" value={state.searchFiatVal} prefix={<span className="icon lg search-angle drawer-search" />} onChange={handleFiatSearch} size="middle" bordered={false} className="cust-search" />
              <List
                itemLayout="horizontal"
                dataSource={state.fiatWallets}
                className="crypto-list auto-scroll wallet-list"
                loading={fiatWalletsLoading}
                locale={{
                    emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                        <Translate content="No_data" />
                    } />
                }}
                renderItem={item => (

                    <List.Item className="drawer-list-fiat sendfiat-coins" onClick={() => selectsCurrency(item)}>
                    <Link>
                      <List.Item.Meta className='drawer-coin'
                        avatar={<Image preview={false} src={item.imagePath} />}

                        title={<div className="wallet-title">{item.currencyCode}</div>}
                      />
                       <><div className="text-right coin-typo">
                         <NumberFormat value={item.avilable} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={item.currencyCode == 'USD' && '$' || item.currencyCode=='EUR' && '€'|| item.currencyCode =='GBP' && '£' || item.currencyCode=='CHF' && '₣' || item.currencyCode=='SGD' && 'S$'} renderText={(value, props) => <div {...props} >{value}</div>} />
                    </div></>
                    </Link>
                  </List.Item>
                )}
              /></>)}
            </div>
        </React.Fragment>
      ),
      enteramount: (
        <>
             <div className="text-center sell-title-styels">
             <Translate
                        content={"tab_InternalCustomerTransfer"}
                            component={Paragraph}
                            className="drawer-maintitle"
                        />
                        </div>
                        {state.isVarificationLoader && <Loader />}
                       {state.isVerificationEnable&& !state.isVarificationLoader&& <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <div className="summarybal total-amount mb-8">
                   {!state?.selectedCurrency?.currencyCode ? props.walletCode?.walletCode : state?.selectedCurrency?.currencyCode }{" "}
                        <NumberFormat
                          decimalScale={2}
                          placeholder={"Enter Amount"}
                          thousandSeparator={true} displayType={"text"}
                          disabled
                          value={!state?.selectedCurrency?.avilable?props.walletCode.amount:state?.selectedCurrency?.avilable}
                        />
                      </div>
                    </Col>
                    </Row>      }
          { !state.isVarificationLoader&& <Form
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
                      if (props?.onClose) {
                          props?.onClose();
                      }
                  }}>security section</Link></Text>}
                  type="warning"
                  showIcon
                  closable={false}
              />
              )}
              {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
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
                            setState({ ...state, amount: enteramtForm.current?.getFieldsValue().amount})
                            setErrorMessage(null);
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
                                        {state.validIban && state.isShowCustomerDetails &&customerDetails!==null &&
                                            <><Row>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label">
                                                            Personal/Business Name
                                                        </label>
                                                        <div class><Text className="kpi-val">{customerDetails?.fullName || '-'}</Text></div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label ">Email Address</label>
                                                        <div class><Text className="kpi-val">{customerDetails?.email || '-'}</Text></div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                                    <div className="kpi-divstyle">
                                                        <label className="kpi-label ">Phone Number</label>
                                                        <div class><Text className="kpi-val">{customerDetails?.phoneNumber || '-'}</Text></div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            </>}
                                            {(!state.validIban || !state.isShowCustomerDetails ||customerDetails===null) &&    
                                           <div>
                                            <span className="info-details">No customer details available</span>
                                           </div>
                                      }
                                    </Spin>
                                </div>
                                {state.validIban && state.isShowCustomerDetails && customerDetails!==null && <Col>
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
            </Form>}
            </>
      ),
  }
  return steps[step];
}
return <React.Fragment>
{!isPersonalSummary &&renderStep()}
{isPersonalSummary && <CustomerTransferSummary back={goBack} onClose={props?.onClose}/>}
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
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CustomerTransfer));