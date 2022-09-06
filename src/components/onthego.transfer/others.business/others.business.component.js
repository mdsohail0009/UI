import { Form, Row, Col, Divider, Typography, Input, Button } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import BusinessTransfer from "./transfer";
const { Paragraph, Text } = Typography;
const { TextArea } = Input;
class OthersBusiness extends Component {
    form;
    state = {
        payeeLu: []
    };
    componentDidMount() {
        this.form = React.createRef();
    }
    render() {
        const { isUSDTransfer } = this.props;
        console.log(isUSDTransfer)
        if (isUSDTransfer) { return <BusinessTransfer onContinue={() => this.props.onContinue()} /> }
        else {
            return <>
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph>
                <Form initialValues={{}}
                    className="custom-label  mb-0"
                    form={this.form}
                    onFinish={(values)=>{}}
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
                                    placeholder={" Save Whitelist name as"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="mb-8 fs-18 text-white fw-500 mt-16"  style={{ fontSize: 18}} >Recipient's Details</Paragraph>
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
                                <div><Text className="fs-14 fw-400 text-purewhite">Barcslays Bank UK PLC</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>BIC</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">BUKBGB22</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">CHELTENHAM</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">CHELTENHAM</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Country</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">United Kingdom (GB)</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>State</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">XXXX</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>City</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">Leicester</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Zip</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">LE87 2BB</Text></div>

                            </Col>
                        </Row>
                    </div>
                    <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>
                    <AddressDocumnet />
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
export default OthersBusiness;