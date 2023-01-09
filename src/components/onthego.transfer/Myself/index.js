
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Input, Tabs, Button,Alert,Spin,Image } from 'antd'
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls"
import { validateContentRule } from "../../../utils/custom.validator";
import { connect } from "react-redux";
import Loader from "../../../Shared/loader";
import {confirmTransaction} from '../api';
import alertIcon from '../../../assets/images/pending.png';
import NumberFormat from "react-number-format";
const { Paragraph,Title } = Typography;

//const { Option } = Select;
const { Text } = Typography;
const { TextArea } = Input;
const MyselfNewTransfer = ({ currency, isBusiness,onTheGoObj, ...props }) => {
    const [form] = Form.useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic', tabType: 'domestic' });
    const [bankDetails, setbankDetails] = useState({})
    const [saveTransferObj,setsaveObj]= useState({"id":"00000000-0000-0000-0000-000000000000","customerId":props.userConfig.id,"favouriteName":"","firstName":"","lastName":"","beneficiaryName":"","line1":"","line2":"","line3":"","transferType":"","addressType":"","isAgree":true,"info":"","isBankContact":true,"relation":"","reasonOfTransfer":"","amount":0,"payeeAccountModels":[{"id":"00000000-0000-0000-0000-000000000000","line1":"","line2":"","city":"","state":"","country":"","postalCode":"","currencyType":"","walletCode":"","accountNumber":"","swiftRouteBICNumber":"","bankName":"","userCreated":props?.userConfig.firstName + props?.userConfig.lastName,"iban":"","bic":"","bankBranch":"","abaRoutingCode":"","documents":null}]})
    const [createTransfer,setcreateTransfer]=useState({"favouriteName":"","accountNumber":"","swiftRouteBICNumber":"","bankName":"","iban":"","abaRoutingCode":"","line1":"","line2":""})
    const [recipientDetails,setRecipientDetails]=useState({})
	const [isBtnLoading, setBtnLoading] = useState(false);
    const [isLoading,setLoader]=useState(true)
    const [ibanLoading,setIbanLoader]=useState(false)
    const [errorMessage,seterrorMessage]=useState();
    const useDivRef = React.useRef(null);
    const [validIban,setValidIban]=useState(false)
    const [showDeclartion, setShowDeclartion] = useState(false);
    const [isEdit,setIsEdit]=useState(false);
    const [isSelectedId,setIsSelectedId] = useState(null);
    const [isShowBankDetails,setIsShowBankDetails]=useState(false)
    const [enteredIbanData,setEnteredIbanData] = useState(null);
    const [isShowValid,setIsShowValid] = useState(false);
    const [isValidateLoading, setValidateLoading] = useState(false);
    useEffect(() => {
        getRecipientDetails()
    }, []);//eslint-disable-line react-hooks/exhaustive-deps
    const getRecipientDetails = async () => {
        setLoader(true)
        const response = await apiCalls.getRecipientData( props.selectedAddress?.id || "00000000-0000-0000-0000-000000000000",isBusiness ? 'OwnBusiness' : 'MySelf');
        if (response.ok) {
            if (props.selectedAddress?.id) {
                setLoader(false);setRecipientDetails(response.data)
                setsaveObj(response.data)
                props.onEdit(true);
                setbankDetails(response.data.payeeAccountModels[0])
                setcreateTransfer(response.data)
                let obj=Object.assign({},response.data.payeeAccountModels[0])
                form.setFieldsValue({favouriteName:response.data.favouriteName,accountNumber:obj.accountNumber,swiftRouteBICNumber:obj.swiftRouteBICNumber,
                bankName:obj.bankName,iban:obj.iban,abaRoutingCode:obj.abaRoutingCode,line1:obj.line1,line2:obj.line2})
                setAddressOptions({addressType:response.data.addressType,transferType:response.data.transferType,domesticType:response.data.transferType,tabType:response.data.transferType})
                if(obj.iban){
                    getBankDeails(obj.iban,"true")
                }let edit = true; props?.onEdit(edit);setIsEdit(true)
                setIsSelectedId(response.data?.id);
            } else {
                props.onEdit(false);
                setRecipientDetails(response.data); setLoader(false)
            }
        } else {
            seterrorMessage(isErrorDispaly(response)); setLoader(false)
        }
    }
    const saveTransfer = async(values) => {
        setBtnLoading(true);
        seterrorMessage(null);
        if (Object.hasOwn(values, 'iban')) {
            if ((!bankDetails || Object.keys(bankDetails).length === 0)) {
                setBtnLoading(false);
                seterrorMessage("Please click validate button before saving");
                useDivRef.current.scrollIntoView();
                return;
            }
        }
        let saveObj=Object.assign({},saveTransferObj)
        saveObj.favouriteName=values.favouriteName;
        saveObj.payeeAccountModels[0].iban= (currency==='EUR' || (addressOptions?.transferType === "internationalIBAN"||addressOptions?.tabType === "internationalIBAN")) ? values.iban : null;
        saveObj.payeeAccountModels[0].accountNumber=currency===('USD' || 'GBP')?values.accountNumber:null;
        saveObj.payeeAccountModels[0].abaRoutingCode=values.abaRoutingCode?values.abaRoutingCode:null;
        saveObj.payeeAccountModels[0].swiftRouteBICNumber=values.swiftRouteBICNumber?values.swiftRouteBICNumber:null;
        saveObj.payeeAccountModels[0].line1=currency==='USD'?values.line1:null;
        saveObj.payeeAccountModels[0].line2=currency==='USD'?values.line2:null;
        saveObj.payeeAccountModels[0].state=bankDetails.state?bankDetails.state:null;
        saveObj.payeeAccountModels[0].bankName=(currency==='EUR' || addressOptions?.tabType === "internationalIBAN")?bankDetails.bankName:values.bankName;
        saveObj.payeeAccountModels[0].bic=bankDetails.routingNumber?bankDetails.routingNumber:null;
        saveObj.payeeAccountModels[0].branch=bankDetails.branch?bankDetails.branch:null;
        saveObj.payeeAccountModels[0].country=bankDetails.country?bankDetails.country:null;
        saveObj.payeeAccountModels[0].city=bankDetails.city?bankDetails.city:null;
        saveObj.payeeAccountModels[0].postalCode=bankDetails.zipCode?(bankDetails.zipCode || values.postalCode):null;
        saveObj.firstName=recipientDetails.firstName;
        saveObj.lastName=recipientDetails.lastName;
        saveObj.beneficiaryName=recipientDetails.beneficiaryName;
        saveObj.line1=recipientDetails.line1;
        saveObj.line2=recipientDetails.line2;
        saveObj.line3=recipientDetails.line3;
        saveObj.addressType=isBusiness?'ownbusiness':'myself';
        saveObj.transferType=currency==='EUR'?'sepa':addressOptions.tabType;
        saveObj.payeeAccountModels[0].currencyType='fiat';
        saveObj.payeeAccountModels[0].walletCode=currency;
        saveObj.amount=onTheGoObj?.amount;
        if(isEdit){
            saveObj.id = isSelectedId ? isSelectedId: saveObj.payeeId;
        }
        const response = await apiCalls.saveTransferData(saveObj);
        if (response.ok) {
            if (props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: onTheGoObj?.amount, reasonOfTransfer: null })
                if (confirmRes.ok) {
                    setBtnLoading(false);
                    props.onContinue(confirmRes.data);
                } else {
                    setBtnLoading(false);
                    seterrorMessage(isErrorDispaly(confirmRes));
                    useDivRef.current.scrollIntoView();
                }
            }
            else {
                setShowDeclartion(true);
                props.isHideTabs(false)
            }
            props.headingUpdate(true)
        }else{seterrorMessage(isErrorDispaly(response));
            useDivRef.current.scrollIntoView();
		setBtnLoading(false);
        }
    }
    const getBankDeails = async (e,isValid) => {
        setbankDetails({});
        setEnteredIbanData(e);
        seterrorMessage(null);
        setIsShowValid(false);
        if(e?.length>=10&&isValid){
            setValidIban(true) 
            isValid ? setIbanLoader(true) : setIbanLoader(false);
            const response = await apiCalls.getIBANData(e);
            if (response.ok) {
                if(isValid&&response.data && (response.data?.routingNumber || response.data?.bankName)){
                    setValidIban(true)
                    setIsShowBankDetails(true);
                    setValidateLoading(false);
                    setbankDetails(response.data);
                }else{
                    setValidateLoading(false);
                     setValidIban(false)
                    if (bankDetails && (!bankDetails?.routingNumber || !bankDetails?.bankName)) {
                        setIsShowBankDetails(false);
                        setIbanLoader(false)
                        setbankDetails({})
                        seterrorMessage("No bank details are available for this IBAN number");
                        useDivRef.current.scrollIntoView();
                        return;
                    }
                }
              setIbanLoader(false)
            }else{
                seterrorMessage(isErrorDispaly(response));
                setbankDetails({})
                setIbanLoader(false)
                setValidIban(false)
                setValidateLoading(false);
            }
        }
        if(e?.length>=10&&!isValid) {
            setValidIban(true); 
            setIsShowBankDetails(false);
            setValidateLoading(false);
        } 
    }

    const onIbanValidate = (e) => {
        setValidateLoading(true);
        seterrorMessage(null);
        if (e?.length >= 10) {
            if (e &&!/^[A-Za-z0-9]+$/.test(e)) {
                setIsShowValid(true);
                setIsShowBankDetails(false);
                setbankDetails({});
                form?.validateFields(["iban"], validateIbanType)
            }
            else {
                setIsShowValid(false);
                getBankDeails(e, "true");
            }
        }
        else {
            setIsShowValid(true);
            setValidIban(false);
            setIsShowBankDetails(false); 
            setbankDetails({});
            form?.validateFields(["iban"], validateIbanType)
        }
    }

    const validateIbanType = (_, value) => {
        setValidateLoading(false);
        if ((!value&&isShowValid)||!value) {
            setIsShowBankDetails(false);
            return Promise.reject(apiCalls.convertLocalLang("is_required"));
        } else if ((!validIban&&isShowValid) || value?.length < 10) {
            setIsShowBankDetails(false);
            setbankDetails({})
            return Promise.reject("Please input a valid IBAN");
        } else if (
            (value && isShowValid)&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            setIsShowBankDetails(false);
            setbankDetails({})
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };

    const isErrorDispaly = (objValue) => {
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
    return <>
    <div ref={useDivRef}></div>
    {isLoading &&<Loader /> }
    {!isLoading &&
        <Form layout="vertical" form={form} onFinish={saveTransfer} initialValues={{createTransfer}} scrollToFirstError>
        {showDeclartion &&  <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image width={80} preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully to your email</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="successsubtext">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25">
                    {/* <Button onClick={() => props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn withdraw-popcancel">BACK</Button> */}
                    </div>
            </div></div>}
       {!showDeclartion &&<> {currency === "USD" || currency === "GBP" && <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => { setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });form.resetFields();seterrorMessage(null);setbankDetails({});setValidIban(false); setEnteredIbanData(null) }} activeKey={addressOptions.tabType}>
                        <Tabs.TabPane tab={`Domestic ${currency} Transfer`} className="text-white text-captz"  key={"domestic"} disabled={isEdit}></Tabs.TabPane>
                       { currency !="GBP" && <Tabs.TabPane tab={`International ${currency} Swift`} className="text-white text-captz" key={"international"} disabled={isEdit}></Tabs.TabPane>}
                        <Tabs.TabPane tab={`International ${currency} IBAN`} className="text-white text-captz" key={"internationalIBAN"} disabled={isEdit}></Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </>}
        <Row gutter={[16, 4]} className="send-drawerbtn tabs-innertabs">

                  <Col xs={24} md={24} lg={12} xl={12} xxl={12} className="mobile-viewbtns mobile-btn-pd">
                      <Form.Item className="text-center form-marginB">
                        <Button
                          htmlType="submit"
                          size="large"
                          className="newtransfer-card"
                          // style={{ width: '100%' }}
                        //   loading={this.state.newtransferLoader}
                        //   disabled={this.state.addressLoader}
                        >
                          New Transfer
                        </Button>
                      </Form.Item>
                    </Col>
                     <Col xs={24} md={24} lg={12} xl={12} xxl={12} className="mobile-viewbtns mobile-btn-pd">
                      <Form.Item className="text-center form-marginB">
                        <Button
                          htmlType="button"
                          size="large"
                          className="newtransfer-card"
                          // style={{ width: '100% ' }}
                        //   loading={this.state.addressLoader}
                        //   disabled={this.state.newtransferLoader}
                        //   onClick={this.goToAddressBook}
                        >
                          Address book
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
        
        {currency == 'EUR' && <h2 className="adbook-head" >SEPA Transfer</h2>}
        
        {errorMessage && <Alert type="error" showIcon closable={false} description={errorMessage} />}
        {!isLoading &&<>
        <Row><Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName" className="">
            <Form.Item
                className="custom-forminput custom-label"
                name="favouriteName"
                label={
                    "Save Whitelist Name As"
                }
                
                rules={[
                    {
                        required: true,
                        message: apiCalls.convertLocalLang("is_required"),
                    },
                    {
                        whitespace: true,
                        message: apiCalls.convertLocalLang("is_required"),
                    },
                    {
                        validator: validateContentRule,
                    },
                ]}
            >
               
                <Input
                    maxLength={100}
                        className="cust-input"
                        placeholder='Save Whitelist Name As'
                    />
            </Form.Item>
        </Col>
    </Row>
            <Translate 
                    content="Beneficiary_Details"
                    component={Paragraph}
                    className="adbook-head"
                />

        <div className="alert-info-custom kpi-List">
            <Row>
                {(!isBusiness || currency ==="GBP") && <><Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div className="kpi-divstyle"><label className="kpi-label">
                        First name
                    </label>
                    <div><Text className="kpi-val">{recipientDetails.firstName}</Text></div></div>

                </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <div className="kpi-divstyle"> <label className="kpi-label">
                            Last Name
                        </label>
                        <div><Text className="kpi-val">{recipientDetails.lastName}</Text></div></div>

                    </Col></>}
                {(isBusiness && currency !="GBP") && <> <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div className="kpi-divstyle"><label className="kpi-label">
                        Beneficiary Name
                    </label>
                    <div><Text className="kpi-val">{recipientDetails.beneficiaryName}</Text></div></div>

                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div className="kpi-divstyle"> <label className="kpi-label">
                        Address Line 1
                    </label>
                    <div><Text className="kpi-val">{recipientDetails.line1!=null?recipientDetails.line1:'-'}</Text></div></div>

                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div className="kpi-divstyle"> <label className="kpi-label ">
                        Address Line 2
                    </label>
                    <div><Text className="kpi-val">{recipientDetails.line2!=null?recipientDetails.line2:'-'}</Text></div></div>

                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                <div className="kpi-divstyle"><label className="kpi-label">
                       Address Line 3
                    </label>
                    <div><Text className="kpi-val">{recipientDetails.line3!=null?recipientDetails.line3:'-'}</Text></div></div>

                </Col></>}

            </Row>
        </div>

        <h2  className="adbook-head">Bank Details</h2>
        {(currency == 'EUR'||addressOptions.tabType == 'internationalIBAN') && <Row>
        {(currency == 'EUR'||addressOptions.tabType == 'internationalIBAN') && <Col xs={24} md={14} lg={14} xl={14} xxl={14}>
            <div className="custom-btn-error">
            <Form.Item
                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
                name="iban"
                required
                rules={[
                    {
                        validator: validateIbanType,
                      },
                ]}
                label='IBAN'
                onChange={(e) => {
                    getBankDeails(e.target.value)
                }}
            >
                <Input
                    className="cust-input"
                    placeholder='IBAN'
                    maxLength={30}/>                      
            </Form.Item>
                                        
               
            </div>
        </Col>}
        {(currency === 'EUR'||addressOptions.tabType === 'internationalIBAN') &&<Col xs={24} md={10} lg={10} xl={10} xxl={10}>
            <Button className={`pop-btn dbchart-link pop-validate-btn`}
                loading={isValidateLoading}
                onClick={() => onIbanValidate(enteredIbanData)} >
                <Translate content="validate" />
            </Button>      
        </Col>}
        </Row>}
  <Row gutter={[8, 8]}>
        {(currency === "GBP"  && addressOptions.tabType != 'internationalIBAN') && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50  custom-forminput custom-label pt-8"
                    name="uksortcode"
                    label='UK SORT CODE' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                    ]}
                >
                                            <NumberFormat
                        customInput={Input}
                        thousandSeparator={false}
                        prefix={""}
                        decimalScale={0}
                        allowNegative={false}
                        allowLeadingZeros={true}
                        className="cust-input"
                        placeholder={"Enter Uk Sort code"}
                        maxLength={6}
                        style={{ width: "100%"  }}
                      //  onValueChange={(e) => handleChange(e.value)}
                       // disabled={inputDisable}
                        />
                  
                </Form.Item>
            </Col>}
            </Row>
        <Row>
            {((currency == 'USD' || currency == 'GBP') && addressOptions.tabType !== 'internationalIBAN')  && <> <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="accountNumber"
                    label='Account Number' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },{
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Account Number"
                                    );
                                }else {
                                    return Promise.resolve();
                                }
                            },
                        }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder='Account Number'
                    maxLength={50}/>
                </Form.Item>
            </Col>

                {(currency === 'USD' && addressOptions.tabType === 'international') || currency != 'GBP'&&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="swiftRouteBICNumber"
                        label={currency === 'USD' && addressOptions.tabType === 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },{
                                validator: (_, value) => {
                                    if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            addressOptions.tabType === 'international' ?"Invalid Swift / BIC Code":"Invalid ABA Routing Code"
                                        );
                                    }else {
                                        return Promise.resolve();
                                    }
                                },
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency === 'USD' && addressOptions.tabType === 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                            maxLength={50}/>
                    </Form.Item>
                </Col>}
                {!(currency === 'USD' && addressOptions.tabType === 'international') || currency != 'GBP' &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="abaRoutingCode"
                        label={currency === 'USD' && addressOptions.tabType === 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },{
                                validator: (_, value) => {
                                    if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            addressOptions.tabType === 'international' ?"Invalid Swift / BIC Code":"Invalid ABA Routing Code"
                                        );
                                    }else {
                                        return Promise.resolve();
                                    }
                                },
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            
                            placeholder={currency === 'USD' && addressOptions.tabType === 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                        maxLength={50}/>
                    </Form.Item>
                </Col>}
              {currency != 'GBP' && <>  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="bankName"
                        label='Bank Name'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder='Bank Name'
                            maxLength={100}/>
                    </Form.Item>
                </Col>


                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
                        name="line1"
                        label='Bank Address 1'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }, {
                                validator: validateContentRule,
                            },
                        ]}>
                        <TextArea
                            placeholder={'Bank Address 1'}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
                        name="line2"
                        label='Bank Address 2'
                        rules={[ {
                            validator: validateContentRule,
                        },
                        ]}>
                       
                        <TextArea
                            placeholder={'Bank Address 2'}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col> </>}
  </>}
        </Row>
        {(currency === 'EUR' || addressOptions.tabType === 'internationalIBAN') && <div className="box basic-info alert-info-custom mt-16">
            <Spin spinning={ibanLoading}>
            {validIban&&isShowBankDetails&&<Row>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">
                        Bank Name
                </label>
                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{(bankDetails?.bankName!==''&&bankDetails?.bankName!==null)?bankDetails?.bankName:'-'}</Text></div>

            </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">BIC</label>
                   <div className="pr-24"><Text className="fs-14 fw-400 text-white"> {bankDetails.routingNumber!==''&&bankDetails.routingNumber!==null?bankDetails.routingNumber:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">Branch</label>
                    <div className="pr-24"><Text className="fs-14 fw-400 text-white">{bankDetails.branch!==''&&bankDetails.branch!==null?bankDetails.branch:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">Country</label>
                    <div><Text className="fs-14 fw-400 text-white">{bankDetails.country!==''&&bankDetails.country!==null?bankDetails.country:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">State</label>
                    <div><Text className="fs-14 fw-400 text-white">{bankDetails.state!==''&&bankDetails.state!==null?bankDetails.state:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">City</label>
                    <div><Text className="fs-14 fw-400 text-white">{(bankDetails.city!==''&&bankDetails.city!==null)?bankDetails.city:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">Zip</label>
                    <div><Text className="fs-14 fw-400 text-white">{(bankDetails.zipCode!==''&&bankDetails.zipCode!==null)?bankDetails.zipCode:'-'}</Text></div>

                </Col></Row>}
                
                {(!validIban||!isShowBankDetails)&&<span className="info-details">No bank details available</span>}
                </Spin>
        </div>}
        <div className="buy-usdt-btn">
            <Button
                htmlType="submit"
                size="large"
                block
                className="pop-btn"
                loading={isBtnLoading} >
                {props.type === "manual" && "Save"}
                {props.type !== "manual" && <Translate content="continue" />}
            </Button>
        </div>
        </>}
        </>}
        </Form>}
    </>

}
const connectStateToProps = ({userConfig,
  }) => {
    return {
      userConfig: userConfig.userProfileInfo
    };
  };
export default connect(connectStateToProps)(MyselfNewTransfer);