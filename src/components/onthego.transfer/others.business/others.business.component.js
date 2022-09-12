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
class OthersBusiness extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}, isBtnLoading: false,
        showDeclartion: false,
        iBanValid:false
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee(this.props.userProfile.id, this.props.selectedAddress?.id || "", "business");
        if (response.ok) {
            let data = response.data;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            if (this.props.selectedAddress) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails,line1:data.line1,line2:data.line2,line3:data.line3,bankAddress1:accountDetails.line1,bankAddress2:accountDetails.line2 };
                delete data["documents"];
                if (data?.iban) {
                    this.handleIbanChange({ target: { value: data?.iban } });
                }
            }
            const ibanDetails=response.data?.payeeAccountModels[0]||{}
            this.setState({ ...this.state, errorMessage: null, details: data,ibanDetails }, () => {
                this.setState({ ...this.state, isLoading: false });
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }
    }
    handleIbanChange = async ({ target: { value } }) => {
        if (value?.length > 3) {
            this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true,iBanValid:true });
            const response = await fetchIBANDetails(value);
            if (response.ok) {
                this.setState({ ...this.state, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null, iBanValid:true });
            } else {
                this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, errorMessage: response.data || response.data?.message || response.originalError?.message });
            }
        }else{
            this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false})
        }
    }
    submitPayee = async (values) => {
        let { details, ibanDetails } = this.state;
        let _obj = { ...details, ...values };
        _obj.payeeAccountModels[0].line1 = ibanDetails.bankAddress;
        _obj.payeeAccountModels[0].city = ibanDetails?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban;
        _obj.payeeAccountModels[0].currencyType = "Fiat";
        _obj.payeeAccountModels[0].walletCode = "EUR";
        _obj.payeeAccountModels[0].bankName = ibanDetails?.bankName;
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        _obj.addressType = "Business";
        _obj.transferType = "sepa";
        _obj.amount = this.props.amount;
        this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        const response = await savePayee(_obj);
        if (response.ok) {
            if (this.props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer })
                if (confirmRes.ok) {
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                } else {
                    this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: confirmRes.data?.message || confirmRes.data || confirmRes.originalError?.message, isLoading: false, isBtnLoading: false });
                }
            } else {
                // this.props.onContinue({ close: true, isCrypto: false });
                this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
            }

        } else {
            this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, isBtnLoading: false });
        }

    }
    render() {
        const { isUSDTransfer } = this.props;
        if (this.state.isLoading) {
            return <Loader />
        }
        if (this.state.showDeclartion) {
            return <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25"><Button onClick={() => this.props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
            </div>
        }
        if (isUSDTransfer) { return <BusinessTransfer type={this.props.type} amount={this.props?.amount} onContinue={(obj) => this.props.onContinue(obj)} selectedAddress={this.props.selectedAddress} /> }
        else {
            return <>
                {/* <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph> */}
                <h2 style={{ fontSize: 18, textAlign: 'center', color: "white" }}>SEPA Transfer</h2>
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
                                    maxLength={50}
                                    className="cust-input"
                                    placeholder={"Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Translate style={{ fontSize: 18 }}
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-8  text-white fw-500 mt-16"
                    />
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                                />

                            </Form.Item>
                        </Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-8  text-white fw-500 mt-16" style={{ fontSize: 18 }}>Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="iban"
                                label={"IBAN"}
                                required
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (!value) {
                                                return Promise.reject(apiCalls.convertLocalLang("is_required"));
                                            } else if (!this.state.iBanValid) {
                                                return Promise.reject("Please input a valid IBAN");
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"IBAN"}
                                    onChange={this.handleIbanChange}
                                />

                            </Form.Item>
                        </Col>

                        {this.props.type !== "manual" && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                                    "Reason Of Transfer"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Reason Of Transfer"}
                                    // onChange={this.handleIbanChange}
                                />
                            </Form.Item>
                        </Col>}
                    </Row>
                    <div className="box basic-info alert-info-custom mt-16">
                        <Spin spinning={this.state.ibanDetailsLoading}>
                        {this.state.iBanValid && <Row>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>Bank Name</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.ibanDetails?.bankName || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>BIC</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.ibanDetails?.routingNumber || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.branch || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>Country</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.country || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>State</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.state || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>City</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state?.ibanDetails?.city || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 text-white">
                                    <strong>Zip</strong>
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
                    <Paragraph className="fw-300 mb-0 pb-4 ml-12 text-white-50 pt-16">Please upload supporting docs for transaction*</Paragraph>

                    <AddressDocumnet documents={this.state.details?.payeeAccountModels[0].documents} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="text-right mt-12">
                        {/* <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}> */}
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: 150 }}
                                    disabled={this.state.ibanDetailsLoading}
                                    loading={this.state.isBtnLoading} >
                            {this.props.type === "manual" && "Save"}
                            {this.props.type !== "manual" && "Continue"}
                                    
                                </Button>
                            {/* </Col>
                        </Row> */}
                    </div>
                </Form>}
            </>;
        }

    }
}
export default ConnectStateProps(OthersBusiness);