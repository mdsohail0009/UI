import { Form, Row, Col, Divider, Typography, Input, Button, Alert } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { createPayee, fetchIBANDetails, payeeAccountObj } from "../api";
import BusinessTransfer from "./transfer";
import Loader from '../../../Shared/loader';
import ConnectStateProps from "../../../utils/state.connect";
const { Paragraph, Text } = Typography;
const { TextArea } = Input;
class OthersBusiness extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee(this.props.userProfile.id, "");
        if (response.ok) {
            let data = response.data;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            this.setState({ ...this.state, errorMessage: null, details: data }, () => {
                this.setState({ ...this.state, isLoading: false })
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }
    }
    handleIbanChange = async ({ target: { value } }) => {
        this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true });
        const response = await fetchIBANDetails(value);
        if (response.ok) {
            this.setState({ ...this.state, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null });
        } else {
            this.setState({ ...this.state, ibanDetailsLoading: false, errorMessage: response.data || response.data?.message || response.originalError?.message });
        }
    }
    setPayeeModal = (values) => {

    }
    setMasterObj = (values) => {

    }
    submitPayee = (values) => {

    }
    render() {
        const { isUSDTransfer } = this.props;
        if (isUSDTransfer) { return <BusinessTransfer onContinue={() => this.props.onContinue()} /> }
        else {
            if (this.state.isLoading) { return <Loader /> }
            return <>
                {this.state.errorMessage && <Alert type="error" showIcon closable={false} message={"An error occured"} description={this.state.errorMessage} />}
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph>
                <Form initialValues={this.state.details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
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
                                    maxLength={20}
                                    className="cust-input"
                                    placeholder={"Save Whitelist name as"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="mb-8 fs-18 text-white fw-500 mt-16" style={{ fontSize: 18 }} >Recipient's Details</Paragraph>
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Recipient's Bank Details</Paragraph>
                    <Divider />
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="iban"
                                label={"IBAN"}
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
                                    placeholder={"IBAN"}
                                    onChange={this.handleIbanChange}
                                />

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="relation"
                                label={"Relationship to beneficiary"}
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
                                    placeholder={"Relationship to beneficiary"}
                                />

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                                    "Reason for transfer"
                                }
                            >
                                <TextArea
                                    placeholder={"Reason for transfer"}
                                    className="cust-input cust-text-area address-book-cust"
                                    autoSize={{ minRows: 1, maxRows: 1 }}
                                    maxLength={100}
                                ></TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="box basic-info alert-info-custom mt-16">
                        <Row>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Bank Name</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.ibanDetails?.bankName || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>BIC</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.ibanDetails?.routingNumber || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state?.ibanDetails?.branch || "-"}</Text></div>

                            </Col>
                            {/* <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">CHELTENHAM</Text></div>

                            </Col> */}
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Country</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state?.ibanDetails?.country || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>State</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state?.ibanDetails?.state || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>City</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state?.ibanDetails?.city || "-"}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Zip</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state?.ibanDetails?.zipCode || "-"}</Text></div>

                            </Col>
                        </Row>
                    </div>
                    <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>

                    <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="align-center">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}>
                                <Button onClick={() => {
                                    //this.props.onContinue()
                                }
                                }
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: 300 }}
                                >
                                    Continue
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </>;
        }

    }
}
export default ConnectStateProps(OthersBusiness);