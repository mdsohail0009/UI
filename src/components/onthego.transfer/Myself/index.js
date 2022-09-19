
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Select, AutoComplete, Input, Tabs, Button,Alert,Spin,Image } from 'antd'
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls"
import { validateContentRule } from "../../../utils/custom.validator";
import { connect } from "react-redux";
import Loader from "../../../Shared/loader";
import {confirmTransaction} from '../api';
import alertIcon from '../../../assets/images/pending.png';
const { Paragraph,Title } = Typography;

const { Option } = Select;
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
    useEffect(() => {
        getRecipientDetails()
    }, [])
    const getRecipientDetails = async () => {
        setLoader(true)
        const response = await apiCalls.getRecipientData(props.userConfig.id, isBusiness ? 'OwnBusiness' : 'MySelf', props.selectedAddress?.id || "00000000-0000-0000-0000-000000000000");
        if (response.ok) {
            if (props.selectedAddress?.id) {
                setLoader(false);setRecipientDetails(response.data)
                setsaveObj(response.data)
                setbankDetails(response.data.payeeAccountModels[0])
                setcreateTransfer(response.data)
                let obj=Object.assign({},response.data.payeeAccountModels[0])
                form.setFieldsValue({favouriteName:response.data.favouriteName,accountNumber:obj.accountNumber,swiftRouteBICNumber:obj.swiftRouteBICNumber,
                bankName:obj.bankName,iban:obj.iban,abaRoutingCode:obj.abaRoutingCode,line1:obj.line1,line2:obj.line2})
                setAddressOptions({addressType:response.data.addressType,transferType:response.data.transferType,domesticType:response.data.transferType,tabType:response.data.transferType})
                if(obj.iban){
                    getBankDeails(obj.iban)
                }let edit = true; props?.onEdit(edit);setIsEdit(true)
                setIsSelectedId(response.data?.id);
            } else {
                setRecipientDetails(response.data); setLoader(false)
            }
        } else {
            seterrorMessage(isErrorDispaly(response)); setLoader(false)
        }
    }
    const saveTransfer = async(values) => {
		setBtnLoading(true);
        let saveObj=Object.assign({},saveTransferObj)
        saveObj.favouriteName=values.favouriteName;
        saveObj.payeeAccountModels[0].iban=currency=='EUR'?values.iban:null;
        saveObj.payeeAccountModels[0].accountNumber=currency=='USD'?values.accountNumber:null;
        saveObj.payeeAccountModels[0].abaRoutingCode=values.abaRoutingCode?values.abaRoutingCode:null;
        saveObj.payeeAccountModels[0].swiftRouteBICNumber=values.swiftRouteBICNumber?values.swiftRouteBICNumber:null;
        saveObj.payeeAccountModels[0].line1=currency=='USD'?values.line1:null;
        saveObj.payeeAccountModels[0].line2=currency=='USD'?values.line2:null;
        saveObj.payeeAccountModels[0].state=bankDetails.state?bankDetails.state:null;
        saveObj.payeeAccountModels[0].bankName=currency=='EUR'?bankDetails.bankName:values.bankName;
        saveObj.payeeAccountModels[0].bic=bankDetails.routingNumber?bankDetails.routingNumber:null;
        saveObj.payeeAccountModels[0].branch=bankDetails.branch?bankDetails.branch:null;
        saveObj.payeeAccountModels[0].country=bankDetails.country?bankDetails.country:null;
        saveObj.payeeAccountModels[0].city=bankDetails.city?bankDetails.city:null;
        saveObj.payeeAccountModels[0].postalCode=bankDetails.zipCode?bankDetails.zipCode:null;
        saveObj.firstName=recipientDetails.firstName;
        saveObj.lastName=recipientDetails.lastName;
        saveObj.beneficiaryName=recipientDetails.beneficiaryName;
        saveObj.line1=recipientDetails.line1;
        saveObj.line2=recipientDetails.line2;
        saveObj.line3=recipientDetails.line3;
        saveObj.addressType=isBusiness?'ownbusiness':'myself';
        saveObj.transferType=currency=='EUR'?'sepa':addressOptions.tabType;
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
                setShowDeclartion(true)
            }
        }else{seterrorMessage(isErrorDispaly(response));
            useDivRef.current.scrollIntoView();
		setBtnLoading(false);
        }
    }
    const getBankDeails = async (e) => {
        if(e?.length>3){
            setValidIban(true)
            setIbanLoader(true)
            const response = await apiCalls.getIBANData(e);
            if (response.ok) {
                setbankDetails(response.data)
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    setValidIban(true)
                }else{
                    setValidIban(false)
                }
                setIbanLoader(false)
            }else{
                seterrorMessage(isErrorDispaly(response));
                setbankDetails({})
                setIbanLoader(false)
                setValidIban(false)
            }
        }else{
            setValidIban(false)
            setbankDetails({})
        }
        
    }
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
        {showDeclartion && <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25"><Button onClick={() => props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
            </div>}
       {!showDeclartion &&<> {currency === "USD" && <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => { setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });form.resetFields();seterrorMessage(null) }} activeKey={addressOptions.tabType}>
                        <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz"  key={"domestic"} disabled={isEdit}></Tabs.TabPane>
                        <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"} disabled={isEdit}></Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </>}
        
        
        {currency == 'EUR' && <h2 className="text-white fw-600" style={{ fontSize: 18, textAlign: 'center' }}>SEPA Transfer</h2>}
        
        {errorMessage && <Alert type="error" showIcon closable={false} description={errorMessage} />}
        {!isLoading &&<>
        <Row gutter={[4, 4]}><Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName" className="mt-16">
            <Form.Item
                className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label"
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
            {/* {currency == 'EUR' && !isBusiness && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="iban"
                    required
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.reject(apiCalls.convertLocalLang("is_required"));
                                } else if (!validIban) {
                                    return Promise.reject("Invalid Iban");
                                } else {
                                    return Promise.resolve();
                                }
                            },
                        },
                    ]}
                    label='IBAN'
                >
                    <Input
                        className="cust-input"
                        placeholder='IBAN'
                        onChange={(e)=>getBankDeails(e)}/>
                </Form.Item>
            </Col>} */}
            </Row>
            <Translate style={{ fontSize: 18,color: "white" }}
                    content="Beneficiary_Details"
                    component={Paragraph}
                    className="mt-24 text-captz px-4 text-white fw-600"
                />

        <div className="box basic-info alert-info-custom">
            <Row>
                {!isBusiness && <><Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-600 text-white">
                        First name
                    </label>
                    <div><Text className="fs-14 fw-400 text-white">{recipientDetails.firstName}</Text></div>

                </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-12 fw-600 text-white">
                            Last Name
                        </label>
                        <div><Text className="fs-14 fw-400 text-white">{recipientDetails.lastName}</Text></div>

                    </Col></>}
                {isBusiness && <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-600 text-white">
                        Beneficiary Name
                    </label>
                    <div><Text className="fs-14 fw-400 text-white">{recipientDetails.beneficiaryName}</Text></div>

                </Col>}
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-600 text-white ">
                        Address Line 1
                    </label>
                    <div><Text className="fs-14 fw-400 text-white">{recipientDetails.line1!=null?recipientDetails.line1:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-600 text-white ">
                        Address Line 2
                    </label>
                    <div><Text className="fs-14 fw-400 text-white">{recipientDetails.line2!=null?recipientDetails.line2:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-600 text-white">
                       Address Line 3
                    </label>
                    <div><Text className="fs-14 fw-400 text-white">{recipientDetails.line3!=null?recipientDetails.line3:'-'}</Text></div>

                </Col>

            </Row>
        </div>

        <h2 style={{ fontSize: 18,}} className="mt-36 text-captz px-4 text-white fw-600">Bank Details</h2>
        {currency == 'EUR' && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
                name="iban"
                required
                rules={[
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.reject(apiCalls.convertLocalLang("is_required"));
                            } else if (!validIban) {
                                return Promise.reject("Please input a valid IBAN");
                            } else if (
                                value &&
                                !/^[A-Za-z0-9]+$/.test(value)
                            ) 
                            {
                                return Promise.reject(
                                    "Please input a valid IBAN"
                                );
                            }
                            else {
                                return Promise.resolve();
                            }
                        },
                    },
                    // {
                    //     validator: validateContentRule
                    // }
                ]}
                label='IBAN'
                onChange={(e) => {
                    getBankDeails(e.target.value)
                }}
            >
                <Input
                    className="cust-input"
                    placeholder='IBAN'
                    // onBlur={(e)=>getBankDeails(e)}
                    maxLength={50}/>
            </Form.Item>
        </Col>}
        <Row gutter={[8, 8]}>
            {currency == 'USD' && <> <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50  custom-forminput custom-label pt-8"
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

                {currency == 'USD' && addressOptions.tabType == 'international'&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-400 mb-8 px-4 text-white pt-8"
                        name="swiftRouteBICNumber"
                        label={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
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
                                            addressOptions.tabType == 'international' ?"Invalid Swift / BIC Code":"Invalid ABA Routing Code"
                                        );
                                    }else {
                                        return Promise.resolve();
                                    }
                                },
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                            maxLength={50}/>
                    </Form.Item>
                </Col>}
                {!(currency == 'USD' && addressOptions.tabType == 'international')&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
                        name="abaRoutingCode"
                        label={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
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
                                            addressOptions.tabType == 'international' ?"Invalid Swift / BIC Code":"Invalid ABA Routing Code"
                                        );
                                    }else {
                                        return Promise.resolve();
                                    }
                                },
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            
                            placeholder={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC Code' : 'ABA Routing Code'}
                        maxLength={50}/>
                    </Form.Item>
                </Col>}
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-8"
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
                            // {
                            //     validator:
                            //      (_, value) => {
                            //         if (
                            //             value &&
                            //             !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Please enter valid content"
                            //             );
                            //         }else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // }
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
                            // {
                            //     validator: (_, value) => {
                            //         if (
                            //             value &&
                            //             !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Please enter valid content"
                            //             );
                            //         }else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // }
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
                            // {
                            //     validator: (_, value) => {
                            //         if (
                            //             value &&
                            //             !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Please enter valid content"
                            //             );
                            //         }else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // }
                        ]}>
                       
                        <TextArea
                            placeholder={'Bank Address 2'}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col></>}
        </Row>
        {currency == 'EUR' && <div className="box basic-info alert-info-custom mt-16">
            <Spin spinning={ibanLoading}>
            {validIban&&<Row>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">
                        Bank Name
                </label>
                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{(bankDetails?.bankName!=''&&bankDetails?.bankName!=null)?bankDetails?.bankName:'-'}</Text></div>

            </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">BIC</label>
                   <div className="pr-24"><Text className="fs-14 fw-400 text-white"> {bankDetails.routingNumber!=''&&bankDetails.routingNumber!=null?bankDetails.routingNumber:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">Branch</label>
                    <div className="pr-24"><Text className="fs-14 fw-400 text-white">{bankDetails.branch!=''&&bankDetails.branch!=null?bankDetails.branch:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500 ">Country</label>
                    <div><Text className="fs-14 fw-400 text-white">{bankDetails.country!=''&&bankDetails.country!=null?bankDetails.country:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">State</label>
                    <div><Text className="fs-14 fw-400 text-white">{bankDetails.state!=''&&bankDetails.state!=null?bankDetails.state:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">City</label>
                    <div><Text className="fs-14 fw-400 text-white">{(bankDetails.city!=''&&bankDetails.city!=null)?bankDetails.city:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-500">Zip</label>
                    <div><Text className="fs-14 fw-400 text-white">{(bankDetails.zipCode!=''&&bankDetails.zipCode!=null)?bankDetails.zipCode:'-'}</Text></div>

                </Col></Row>}
                
                {(!validIban)&&<span>No bank details available</span>}
                </Spin>
        </div>}
        <div className="text-center mt-36">
            <Button
                htmlType="submit"
                size="large"
                className="pop-btn px-36"
                style={{ width:'100%' }}
                loading={isBtnLoading} 
            >
                                {props.type === "manual" && "Save"}
                                {props.type !== "manual" && <Translate content="continue" />}
                
            </Button>
        </div></>}
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