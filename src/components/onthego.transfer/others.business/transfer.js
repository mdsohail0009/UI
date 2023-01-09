import { Alert, Tabs } from "antd";
import { Form, Row, Col, Typography, Input, Button, Image, Spin } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import { validateContentRule } from "../../../utils/custom.validator";
import ConnectStateProps from "../../../utils/state.connect";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, payeeAccountObj, savePayee, fetchIBANDetails } from "../api";
import DomesticTransfer from "./domestic.transfer";
import InternationalTransfer from "./international.transfer";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
const { Paragraph, Title, Text } = Typography;
const { TextArea } = Input;
class BusinessTransfer extends Component {
    form = React.createRef();useDivRef=React.createRef()
    state = {
        errorMessage: null,
        isLoading: true,
        details: {},
        selectedTab: this.props.transferData?.transferType || "domestic", 
        isBtnLoading: false,
        showDeclaration: false,isEdit:false,
        isSelectedId: null,
        isShowValid: false,
        isValidCheck: false,
        iBanValid: false,
         ibanDetails: {},
        isValidateLoading: false,
        ibanDetailsLoading: false,
        isValidateMsg: false
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
            let data = this.props.transferData;
            let edit=false;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
                data.payeeAccountModels[0].documents = {"transfer": "", "payee": ""}
            }
            if (this.props.selectedAddress?.id) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails, line1: data.line1, line2: data.line2, line3: data.line3, bankAddress1: accountDetails.line1, bankAddress2: accountDetails.line2 };
                delete data["documents"];
                 edit = true;
            }
            if(data.transferType=== "international"){
                this.setState({ ...this.state, selectedTab:data.transferType })
            }
            else if(data.transferType=== "internationalIBAN"){
                this.setState({ ...this.state, selectedTab:data.transferType })
                 this.handleIbanChange({ target: { value: data?.iban, isNext: true } });
            }
            else{
                this.setState({ ...this.state, selectedTab:"domestic" })  
            }
            const ibanDetails = this.props.transferData?.payeeAccountModels[0] || {}
            this.setState({ ...this.state, errorMessage: null, details: data,isEdit:edit, isSelectedId:  this.props.transferData.id, ibanDetails}, () => {
                this.setState({ ...this.state, isLoading: false })
            });
       

    }
    submitPayee = async (values) => {
        let { details, selectedTab,isEdit,isSelectedId, ibanDetails } = this.state;
        this.setState({ ...this.state, errorMessage: null});
        if (Object.hasOwn(values, 'iban')) {
        this.setState({ ...this.state, errorMessage: null});
        if ((!ibanDetails || Object.keys(ibanDetails).length === 0)) {
            this.setState({ ...this.state, errorMessage: "Please click validate button before saving", isLoading: false, isBtnLoading: false });
            this.useDivRef.current.scrollIntoView()
            return;
        }
        }
        let _obj = { ...details, ...values };
        _obj.payeeAccountModels[0].currencyType = "Fiat";
        _obj.payeeAccountModels[0].walletCode = "USD";
        _obj.payeeAccountModels[0].accountNumber = values?.accountNumber;
        _obj.payeeAccountModels[0].bankName = selectedTab === "internationalIBAN" ? ibanDetails?.bankName :  values?.bankName;
        _obj.payeeAccountModels[0].abaRoutingCode = values?.abaRoutingCode;
        _obj.payeeAccountModels[0].swiftRouteBICNumber = values?.swiftRouteBICNumber;
        _obj.payeeAccountModels[0].line1 = selectedTab === "internationalIBAN" ? ibanDetails?.bankAddress : values.bankAddress1;
        _obj.payeeAccountModels[0].line2 = values.bankAddress2;

        _obj.addressType = "otherbusiness";
        _obj.transferType = selectedTab;
        _obj.amount = this.props.amount;
        _obj.payeeAccountModels[0].city = ibanDetails?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban ? values?.iban : this.form.current?.getFieldValue('iban');
        if(isEdit){
            _obj.id = isSelectedId? isSelectedId:details?.payeeId;
        }
        if (_obj.payeeAccountModels[0].documents) {
            _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        }
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        this.setState({ ...this.state, errorMessage: null, isLoading: false, isBtnLoading: true });

        let temp = JSON.parse(JSON.stringify(_obj))
        temp.payeeAccountModels[0].documents = _obj.payeeAccountModels[0]?.documents?.payee
        
        const response = await savePayee(this.state.isEdit ? _obj : temp);   
        
        if (response.ok) {
            if (this.props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer, documents: _obj.payeeAccountModels[0]?.documents?.transfer })
                if (confirmRes.ok) {this.useDivRef.current.scrollIntoView()
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                } else {
                    this.setState({ ...this.state, errorMessage: confirmRes.data?.message || confirmRes.data || confirmRes.originalError?.message, isLoading: false, isBtnLoading: false });
                }
            } else {
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false, showDeclaration: true });
                this.props?.updatedHeading(true)
            }
        } else {this.useDivRef.current.scrollIntoView()
            this.setState({ ...this.state, details: { ...details, ...values }, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, isBtnLoading: false });
        }
    }
    handleTabChange = (key) => {
        let _obj = { ...this.state.details}
        _obj.payeeAccountModels[0].documents={"transfer": "", "payee": ""}
        this.setState({ ...this.state, selectedTab: key,errorMessage:null, ibanDetails: {}, iBanValid: false, enteredIbanData: null });this.form.current.resetFields();
    }
   
    handleIbanChange = async ({ target: { value,isNext } }) => {
        this.setState({ ...this.state, enteredIbanData: value, isShowValid: false, ibanDetails: {}});
        if (value?.length >= 10 && isNext) {
            this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true,iBanValid:true });
            const response = await fetchIBANDetails(value);
            if (response.ok) {
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    this.setState({ ...this.state, enteredIbanData: value, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null, iBanValid:true, isValidateLoading: false });
                }else{
                    if(this.state.ibanDetails && !this.state.ibanDetails?.routingNumber|| !this.state.ibanDetails?.bankName) {
                        this.setState({ ...this.state, errorMessage: "No bank details are available for this IBAN number", enteredIbanData: value, ibanDetails:{}, ibanDetailsLoading: false,  iBanValid:false, isValidateLoading: false });
                        this.useDivRef.current?.scrollIntoView();
                        return;
                    }
                }
            } else {
                this.setState({ ...this.state, enteredIbanData: value, ibanDetailsLoading: false,iBanValid:false, errorMessage: response.data || response.data?.message || response.originalError?.message, isValidateLoading: false });
            }
        }
        else{
            this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, enteredIbanData: value, isShowValid: false, isValidateLoading: false, ibanDetails: {} })
        }
    }
    onIbanValidate = (e) => {
        let value = e ? e: this.form.current?.getFieldValue('iban');
        if (value?.length >= 10) {
            if (value &&!/^[A-Za-z0-9]+$/.test(value)) {
                this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
                this.form.current?.validateFields(["iban"], this.validateIbanType)
            }
            else {
                this.setState({ ...this.state, isValidCheck: true, isShowValid: false, isValidateLoading: true});
                this.handleIbanChange({ target: { value: value, isNext: true }});
            }
        }
        else {
            this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
            this.form.current?.validateFields(["iban"], this.validateIbanType)
        }
    }

     validateIbanType = (_, value) => {
        this.setState({ ...this.state, isValidateLoading: false});
        if ((!value&&this.state.isShowValid)||!value) {
            return Promise.reject(apiCalls.convertLocalLang("is_required"));
        } else if ((!this.state.iBanValid&&this.state.isShowValid)|| value?.length < 10) {
            this.setState({ ...this.state, ibanDetails : {}});
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            this.setState({ ...this.state,ibanDetails:{}});
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    render() {
        const { isLoading, details, selectedTab, errorMessage } = this.state;
        if (isLoading) {
            return <Loader />
        }
        if (this.state.showDeclaration) {
            return <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image width={80} preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                Please review and sign the document in your email to whitelist your address.
                Please note that your withdrawal will only be processed once the address has been approved by compliance. `}</Text>
            </div>
            </div>
        }
        return <div ref={this.useDivRef}><Tabs className="cust-tabs-fait" onChange={this.handleTabChange} activeKey={selectedTab}>

            <Tabs.TabPane tab="Domestic USD transfer" className="text-white" key={"domestic"} disabled={this.state.isEdit}>
                <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="favouriteName"
                                label={"Save Whitelist Name As"}
                                required
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
                                    placeholder={" Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <h2 className="adbook-head">Recipient's Details</h2>
                    {/* <Divider /> */}
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                required
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
                                label={
                                    "Beneficiary Name"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Beneficiary Name"}
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="relation"
                                label={"Relationship To Beneficiary"}
                                required
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
                                    className="cust-input"
                                    placeholder={"Relationship To Beneficiary"}
                                    maxLength={100}/>

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="fw-400 mb-0 pb-4 ml-12 text-white pt-16">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="adbook-head" >Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <DomesticTransfer type={this.props.type} />
                    {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                    <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents.transfer = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="">

                                <Button
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="pop-btn "
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>

                    </div>
                </Form></div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="International USD Swift" key={"international"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row >
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="favouriteName"
                                label={"Save Whitelist Name As"}
                                required
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
                                    placeholder={" Save Whitelist Name As"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <h2 className="adbook-head">Recipient's Details</h2>
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                required
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
                                label={
                                    "Beneficiary Name"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Beneficiary Name"}
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="relation"
                                label={"Relationship To Beneficiary"}
                                required
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
                                    className="cust-input"
                                    placeholder={"Relationship To Beneficiary"}
                                    maxLength={100}/>

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="fw-400 mb-0 pb-4 ml-12 text-white pt-16">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>
                    <h2  className="adbook-head">Bank Details</h2>
                    <InternationalTransfer type={this.props.type} />
                    {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                payeeAccountModels[0].documents.transfer = docs;
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="text-right mt-12">
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="pop-btn"
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                    </div>
                </Form></div>

            </Tabs.TabPane>

            <Tabs.TabPane tab="International USD IBAN" key={"internationalIBAN"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row >
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="favouriteName"
                                label={"Save Whitelist Name As"}
                                required
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
                                    placeholder={" Save Whitelist Name As"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="adbook-head"  >Recipient's Details</Paragraph>
                    {/* <Divider /> */}
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                required
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
                                label={
                                    "Beneficiary Name"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Beneficiary Name"}
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="relation"
                                label={"Relationship To Beneficiary"}
                                required
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
                                    className="cust-input"
                                    placeholder={"Relationship To Beneficiary"}
                                    maxLength={100}/>

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="fw-400 mb-0 pb-4 ml-12 text-white pt-16">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="adbook-head" >Bank Details</Paragraph>
                    {/* <Divider /> */}
                    {/* <InternationalTransfer type={this.props.type} /> */}
                    <Row>
                   <Col xs={24} md={14} lg={14} xl={14} xxl={14}>
                       <div className=" custom-btn-error">
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="iban"
                                label={"IBAN"}
                                required
                                rules={[
                                    {
                                        validator: this.validateIbanType,
                                      },
                                ]}
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"IBAN"}
                                    //style={{ width:'350px',display:'table-cell !important' }}
                                    onChange={this.handleIbanChange}
                                    maxLength={30}/>

                            </Form.Item>
                            </div>
                       </Col>
                       <Col xs={24} md={10} lg={10} xl={10} xxl={10}>
                       <Button className={`pop-btn dbchart-link pop-validate-btn`} 
                            loading={this.state.isValidateLoading} 
                             onClick={() => this.onIbanValidate(this.state?.enteredIbanData)} >
                                <Translate content="validate" />
                            </Button>
                        </Col>
                         
                    </Row>
                    <div className="box basic-info alert-info-custom mt-16">
                        <Spin spinning={this.state.ibanDetailsLoading}>
                        {this.state.iBanValid && <Row>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500">
                                    Bank Name
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state.ibanDetails?.bankName || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                BIC
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state.ibanDetails?.routingNumber || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Branch
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.branch || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Country
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.country || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    State
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.state || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    City
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.city || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Zip
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.zipCode || "-"}</Text></div>

                            </Col>
                        </Row>}
                        {!this.state.iBanValid && !this.state.ibanDetailsLoading && <Row>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                <div><Text className="info-details">No bank details available</Text></div>

                            </Col>
                        </Row>}
                        </Spin>
                       
                    </div>
                        {this.props?.type !== "manual" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="reasonOfTransfer"
                                required
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
                                label={
                                    "Reason For Transfer"
                                }
                            >
                                <TextArea
                                    placeholder={"Reason For Transfer"}
                                    className="cust-input cust-text-area address-book-cust"
                                    autoSize={{ minRows: 1, maxRows: 1 }}
                                    maxLength={200}
                                ></TextArea>
                            </Form.Item>
                        </Col>}
                        {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                payeeAccountModels[0].documents.transfer = docs;
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="text-right mt-36">
                                <Button
                                   htmlType="submit"
                                   size="large"
                                   block
                                   className="pop-btn"
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                    </div>
                </Form></div>

            </Tabs.TabPane>
        </Tabs></div>
    }
}

export default ConnectStateProps(BusinessTransfer);