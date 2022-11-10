import { Form, Row, Col, Divider, Typography, Input, Button, Alert, Image, Spin } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, createPayee, fetchIBANDetails, payeeAccountObj, savePayee } from "../api";
import BusinessTransfer from "./transfer";
import ConnectStateProps from "../../../utils/state.connect";
import Loader from "../../../Shared/loader";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;
class OthersBusiness extends Component {
    form = React.createRef();
    useDivRef=React.createRef()
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}, isBtnLoading: false,
        showDeclartion: false,
        iBanValid:false,
        isEdit: false,
        isSelectedId: null,
        enteredIbanData: null,
        isShowValid: false,
        isValidateLoading: false,
        isValidCheck: false,
        isValidateMsg: false,
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee(this.props.userProfile.id, this.props.selectedAddress?.id || "", "otherbusiness");
        if (response.ok) {
            let edit=false;
            let data = response.data;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            if (this.props.selectedAddress?.id) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails,line1:data.line1,line2:data.line2,line3:data.line3,bankAddress1:accountDetails.line1,bankAddress2:accountDetails.line2 };
                delete data["documents"];
                if (data?.iban) {
                    this.handleIbanChange({ target: { value: data?.iban, isNext: true } });
                } 
                 edit = true;
            }
            this.props?.onEdit(edit);
            const ibanDetails = response.data?.payeeAccountModels[0] || {}
            this.setState({ ...this.state, errorMessage: null, details: data, ibanDetails }, () => {
                this.setState({ ...this.state, isLoading: false, isEdit: edit, isSelectedId:  response.data?.id });
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }
    }
    handleIbanChange = async ({ target: { value,isNext } }) => {
        this.setState({ ...this.state, ibanDetails: {}, enteredIbanData: value, isShowValid: false});
        if (value?.length >= 10 && isNext) {
            this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true,iBanValid:true });
            const response = await fetchIBANDetails(value);
            if (response.ok) {
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    this.setState({ ...this.state, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null, iBanValid:true, isValidateLoading: false });
                }else{
                    this.setState({ ...this.state, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null, iBanValid:false, isValidateLoading: false });
                }
            } else {
                this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, errorMessage: response.data || response.data?.message || response.originalError?.message, isValidateLoading: false });
            }
        }
        else{
            this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, enteredIbanData: value, isShowValid: false, isValidateLoading: false,ibanDetails: {},})
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
        } else if ((!this.state.iBanValid&&this.state.isShowValid) || value?.length < 10) {
            this.setState({ ...this.state, ibanDetails: {}});
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            this.setState({ ...this.state, ibanDetails: {}});
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    submitPayee = async (values) => {
        let { details, ibanDetails,isSelectedId,isEdit } = this.state;
        if (Object.hasOwn(values, 'iban')) {
            this.setState({ ...this.state, errorMessage: null });
            if ((!ibanDetails || Object.keys(ibanDetails).length == 0)) {
                this.setState({ ...this.state, errorMessage: "Please click validate button before saving.", isLoading: false, isBtnLoading: false });;
                window.scrollTo(0, 0);
                this.useDivRef.current?.scrollIntoView();
                return;
            }
        }
        let _obj = { ...details, ...values };
        _obj.payeeAccountModels[0].line1 = ibanDetails.bankAddress;
        _obj.payeeAccountModels[0].city = ibanDetails?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban ? values?.iban : this.form.current?.getFieldValue('iban');
        _obj.payeeAccountModels[0].currencyType = "Fiat";
        _obj.payeeAccountModels[0].walletCode = "EUR";
        _obj.payeeAccountModels[0].bankName = ibanDetails?.bankName;
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        _obj.addressType = "otherbusiness";
        _obj.transferType = "sepa";
        _obj.amount = this.props.amount;
        if(isEdit){
            _obj.id = isSelectedId ? isSelectedId : details?.payeeId;
        }
        if (_obj.payeeAccountModels[0].documents == null || _obj.payeeAccountModels[0].documents && _obj.payeeAccountModels[0].documents.details.length == 0) {
            this.useDivRef.current.scrollIntoView()
            this.setState({ ...this.state, isLoading: false, errorMessage: 'At least one document is required', isBtnLoading: false });
        }else if (_obj.payeeAccountModels[0].documents) {
            let length = 0;
            for (let k in _obj.payeeAccountModels[0].documents.details){
                if(_obj.payeeAccountModels[0].documents.details[k].state=='Deleted'){
                    length=length+1;
                }
            }
            if(length==_obj.payeeAccountModels[0].documents.details.length){
                this.useDivRef.current.scrollIntoView()
                this.setState({ ...this.state, isLoading: false, errorMessage: 'At least one document is required', isBtnLoading: false });
            } else {
                _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        const response = await savePayee(_obj);
        if (response.ok) {
            if (this.props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer })
                if (confirmRes.ok) {
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                  //  this.useDivRef.current.scrollIntoView()
                } else {
                    this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: confirmRes.data?.message || confirmRes.data || confirmRes.originalError?.message, isLoading: false, isBtnLoading: false });
                  //  this.useDivRef.current.scrollIntoView(0,0)
                  window.scrollTo(0, 0);
                }
            } else {
                // this.props.onContinue({ close: true, isCrypto: false });
                this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
                this.useDivRef.current?.scrollIntoView(0,0)
                this.props.headingUpdate(true)
            }

        } else {
            
            this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, isBtnLoading: false });
           // this.useDivRef.current.scrollIntoView()
        }
    }
}

    }
    render() {
        const { isUSDTransfer } = this.props;
        if (this.state.isLoading) {
            return <Loader />
        }
        if (this.state.showDeclartion) {
            return  <div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25">
                    {/* <Button onClick={() => this.props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn withdraw-popcancel">BACK</Button> */}
                    </div>
            </div></div>
        }
        if (isUSDTransfer) { return <BusinessTransfer type={this.props.type} updatedHeading={this.props?.headingUpdate} amount={this.props?.amount} onContinue={(obj) => this.props.onContinue(obj)} selectedAddress={this.props.selectedAddress} /> }
        else {
            return <><div ref={this.useDivRef}>
                {/* <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph> */}
                <h2 className="text-white fw-600" style={{ fontSize: 18, textAlign: 'center' }}>SEPA Transfer</h2>
                {this.state.isLoading && <Loader />}
                {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}
                {!this.state.isLoading && <Form initialValues={this.state.details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                                    placeholder={"Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Translate style={{ fontSize: 18 }}
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-8 text-white fw-500 mt-16"
                    />
                    {/* <Divider /> */}
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                        <RecipientAddress />
                    </Row>
                    <h2 style={{ fontSize: 18,}} className="mt-36 text-captz px-4 text-white fw-600">Bank Details</h2>
                    
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                   <Col xs={24} md={14} lg={14} xl={14} xxl={14}>
                       <div className=" custom-btn-error">
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                       <Button className={`pop-btn dbchart-link fs-14 fw-500`} style={{width:"150px",marginTop:"36px",height:"42px"}}
                            loading={this.state.isValidateLoading} 
                             onClick={() => this.onIbanValidate(this.state?.enteredIbanData)} >
                                <Translate content="validate" />
                            </Button>
                        </Col>
                       

                        {this.props.ontheGoType == "Onthego" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="fw-300 mb-8 px-4 text-white-50 py-4 custom-forminput custom-label"
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
                                <Input
                                    className="cust-input"
                                    placeholder={"Reason For Transfer"}
                                    // onChange={this.handleIbanChange}
                                    maxLength={200}/>
                            </Form.Item>
                        </Col>}
                         
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
                                <div><Text className="fs-14 fw-400 text-white">No bank details available</Text></div>

                            </Col>
                        </Row>}
                        </Spin>
                       
                    </div>
                    <Paragraph className="fw-400 mb-0 pb-4 ml-12 text-white pt-16">Please upload supporting docs to explain relationship with beneficiary*</Paragraph>

                    <AddressDocumnet documents={this.state.details?.payeeAccountModels[0].documents} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="text-right mt-36">
                        {/* <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}> */}
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn px-36"
                                    //style={{ width:'100%' }}
                                    disabled={this.state.ibanDetailsLoading}
                                    loading={this.state.isBtnLoading} >
                            {this.props.type === "manual" && "Save"}
                            {this.props.type !== "manual" && "Continue"}
                                    
                                </Button>
                            {/* </Col>
                        </Row> */}
                    </div>
                </Form>}</div>
            </>;
        }

    }
}
export default ConnectStateProps(OthersBusiness);