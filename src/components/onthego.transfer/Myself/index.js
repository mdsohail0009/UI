
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Select, AutoComplete, Input, Tabs, Button,Alert } from 'antd'
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls"
import { validateContentRule } from "../../../utils/custom.validator";
import { connect } from "react-redux";
import Loader from "../../../Shared/loader";
import {confirmTransaction} from '../api'


const { Option } = Select;
const { Text } = Typography;
const MyselfNewTransfer = ({ currency, isBusiness,onTheGoObj, ...props }) => {
    const [form] = Form.useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic', tabType: 'domestic' });
    const [bankDetails, setbankDetails] = useState({})
    const [saveTransferObj]= useState({"id":"00000000-0000-0000-0000-000000000000","customerId":props.userConfig.id,"favouriteName":"","firstName":"","lastName":"","beneficiaryName":"","line1":"","line2":"","line3":"","transferType":"","addressType":"","isAgree":true,"info":"","isBankContact":true,"relation":"","reasonOfTransfer":"","amount":0,"payeeAccountModels":[{"id":"00000000-0000-0000-0000-000000000000","line1":"","line2":"","city":"","state":"","country":"","postalCode":"","currencyType":"","walletCode":"","accountNumber":"","swiftRouteBICNumber":"","bankName":"","userCreated":props?.userConfig.firstName + props?.userConfig.lastName,"iban":"","bic":"","bankBranch":"","abaRoutingCode":"","documents":null}]})
    const [createTransfer]=useState({"favouriteName":"","accountNumber":"","swiftRouteBICNumber":"","bankName":"","iban":"","abaRoutingCode":"","line1":"","line2":""})
    const [recipientDetails,setRecipientDetails]=useState({})
	const [isBtnLoading, setBtnLoading] = useState(false);
    const [isLoading,setLoader]=useState(true)
    const [errorMessage,seterrorMessage]=useState();
    const useDivRef = React.useRef(null);
    const [validIban,setValidIban]=useState(true)
    useEffect(() => {
        getRecipientDetails()
    }, [])
    const getRecipientDetails=async()=>{setLoader(true)
        const response = await apiCalls.getRecipientData(props.userConfig.id,isBusiness?'OwnBusiness':'MySelf');
        if (response.ok) {
            setRecipientDetails(response.data);setLoader(false)
        }else{
            seterrorMessage(isErrorDispaly(response));setLoader(false)
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
        saveObj.amount=onTheGoObj.amount;
        const response = await apiCalls.saveTransferData(saveObj);
        if (response.ok) {
            const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: onTheGoObj.amount, reasonOfTransfer: null })
            if (confirmRes.ok) {
                setBtnLoading(false);
                props.onContinue(confirmRes.data);
            } else {
                setBtnLoading(false);
                seterrorMessage(isErrorDispaly(confirmRes));
                useDivRef.current.scrollIntoView();
            }
        }else{seterrorMessage(isErrorDispaly(response));
            useDivRef.current.scrollIntoView();
		setBtnLoading(false);
        }
    }
    const getBankDeails = async (e) => {setValidIban(true)
        if(e.target.value){
            const response = await apiCalls.getIBANData(e.target.value);
            if (response.ok) {
                setbankDetails(response.data)
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    setValidIban(true)
                }else{
                    setValidIban(false)
                }
            }else{
                seterrorMessage(isErrorDispaly(response));
                setbankDetails({})
            }
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
        <Form layout="vertical" form={form} onFinish={saveTransfer} initialValues={{createTransfer}} scrollToFirstError>
       <> {currency === "USD" && <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => { setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });form.resetFields() }}>
                        <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz"  key={"domestic"}></Tabs.TabPane>
                        <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"}></Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </>}
        {isLoading &&<Loader /> }
        {errorMessage && <Alert type="error" showIcon closable={false} message={"An error occured"} description={errorMessage} />}
        {!isLoading &&<>
        {currency == 'EUR' && <h2 style={{ fontSize: 18, textAlign: 'center', color: "white" }}>SEPA transfer</h2>}
        <Row gutter={[16, 16]}><Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName" className="mt-16">
            <Form.Item
                className="text-upper fw-300 mb-4 text-white-50 pt-8 custom-forminput custom-label"
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
                    maxLength={20}
                        className="cust-input"
                        placeholder='Save Whitelist Name As'
                    />
            </Form.Item>
        </Col>
            {currency == 'EUR' && !isBusiness && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                    onBlur={(e)=>getBankDeails(e)}/>
                </Form.Item>
            </Col>}</Row>
        <h2 style={{ fontSize: 18, color: "white" }} className="mt-24 text-captz">Recipient's details</h2>

        <div className="box basic-info alert-info-custom">
            <Row>
                {!isBusiness && <><Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 "> First Name </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.firstName}</Text></div>

                </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-12 fw-300 ">Last Name</label>
                        <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.lastName}</Text></div>

                    </Col></>}
                {isBusiness && <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">Beneficiary Name</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.beneficiaryName}</Text></div>

                </Col>}
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300">Address Line 1</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.line1!=null?recipientDetails.line1:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">Address Line 2</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.line2!=null?recipientDetails.line2:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">Address Line 3</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{recipientDetails.line3!=null?recipientDetails.line3:'-'}</Text></div>

                </Col>

            </Row>
        </div>

        <h2 style={{ fontSize: 18, color: "white" }} className="mt-16 text-captz">Bank details</h2>
        {currency == 'EUR' && isBusiness && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                    onBlur={(e)=>getBankDeails(e)}/>
            </Form.Item>
        </Col>}
        <Row gutter={[16, 16]}>
            {currency == 'USD' && <> <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="text-upper fw-300 mb-4 text-white-50 pt-8 custom-forminput custom-label"
                    name="accountNumber"
                    label='Account Number' required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder='Account Number'
                    />
                </Form.Item>
            </Col>

                {currency == 'USD' && addressOptions.tabType == 'international'&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name="swiftRouteBICNumber"
                        label={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
                        />
                    </Form.Item>
                </Col>}
                {!(currency == 'USD' && addressOptions.tabType == 'international')&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name="abaRoutingCode"
                        label={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
                        />
                    </Form.Item>
                </Col>}
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name="bankName"
                        label='Bank Name'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder='Bank Name'
                        />
                    </Form.Item>
                </Col>


                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name="line1"
                        label='Bank Address 1'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder='Bank Address 1'
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name="line2"
                        label='Bank Address 2'
                    >
                        <Input
                            className="cust-input"
                            placeholder='Bank Address 2'
                        />
                    </Form.Item>
                </Col></>}
        </Row>
        {currency == 'EUR' && <div className="box basic-info alert-info-custom">
            {bankDetails&&bankDetails?.bankName!=''&&bankDetails?.bankName!=null&&<Row>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-12 fw-300 ">Bank Name</label>
                <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails?.bankName!=''&&bankDetails?.bankName!=null)?bankDetails?.bankName:'-'}</Text></div>

            </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">BIC</label>
                   <div><Text className="fs-14 fw-400 text-purewhite"> {bankDetails.routingNumber!=''&&bankDetails.routingNumber!=null?bankDetails.routingNumber:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">Branch</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.branch!=''&&bankDetails.branch!=null?bankDetails.branch:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300 ">Country</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.country!=''&&bankDetails.country!=null?bankDetails.country:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300">State</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.state!=''&&bankDetails.state!=null?bankDetails.state:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300">City</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails.city!=''&&bankDetails.city!=null)?bankDetails.city:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-12 fw-300">Zip</label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails.zipCode!=''&&bankDetails.zipCode!=null)?bankDetails.zipCode:'-'}</Text></div>

                </Col></Row>}
                {(bankDetails.bankName==''||bankDetails.bankName==null)&&<span>No bank details available</span>}
        </div>}
        <div className="text-right mt-12">
            <Button
                htmlType="submit"
                size="large"
                className="pop-btn px-36"
                style={{ minWidth: 150 }}
                loading={isBtnLoading} 
            >
                <Translate content="continue" />
            </Button>
        </div></>}
        </>
        </Form>
    </>

}
const connectStateToProps = ({userConfig,
  }) => {
    return {
      userConfig: userConfig.userProfileInfo
    };
  };
export default connect(connectStateToProps)(MyselfNewTransfer);