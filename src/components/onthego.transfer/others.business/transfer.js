import { Tabs } from "antd";
import { Form, Row, Col, AutoComplete, Select, Divider, Typography, Input, Button } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
const { Option } = Select;
const { Paragraph } = Typography;
const { TextArea } = Input;
class BusinessTransfer extends Component {
    state = { payeeLu: [] }
    render() {
        const { payeeLu } = this.state;
        return <Tabs>
            <Tabs.TabPane tab="Domestic USD transfer" key={"domestic"}>
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph>
                <Form initialValues={{}}
                    className="custom-label  mb-0"
                    form={this.form}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="favouriteName"
                                label={"Save Whitelist name as"}
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
                                <AutoComplete
                                    onChange={(e) => { }}
                                    maxLength={20}
                                    className="cust-input"
                                    placeholder={" Save Whitelist name as"}
                                >
                                    {payeeLu?.map((item, indx) => (
                                        <Option key={indx} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </AutoComplete>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Recipient's Details</Paragraph>
                    <Divider />
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
                        <RecipientAddress />
                    </Row>
                </Form>
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
                            name="relationshiptoBeneficiary"
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
                            name="reasonforTransfer"
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
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>
                <AddressDocumnet />
                <div className="align-center">
                    <Row gutter={[16, 16]}>
                        <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                        <Col xs={12} md={12} lg={12} xl={12} xxl={12}>
                            <Button onClick={() => this.props.onContinue()}
                                htmlType="button"
                                size="large"
                                className="pop-btn mb-36"
                                style={{ minWidth: 300 }}
                            >
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="International USD Swift" key={"international"}>
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16 text-center">SEPA Transfer</Paragraph>
                <Form initialValues={{}}
                    className="custom-label  mb-0"
                    form={this.form}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="favouriteName"
                                label={"Save Whitelist name as"}
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
                                <AutoComplete
                                    onChange={(e) => { }}
                                    maxLength={20}
                                    className="cust-input"
                                    placeholder={" Save Whitelist name as"}
                                >
                                    {payeeLu?.map((item, indx) => (
                                        <Option key={indx} value={item.name}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </AutoComplete>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Recipient's Details</Paragraph>
                    <Divider />
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
                        <RecipientAddress />
                    </Row>
                </Form>
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
                            name="relationshiptoBeneficiary"
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
                            name="reasonforTransfer"
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
                <Paragraph className="mb-16 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>
                <AddressDocumnet />
                <div className="align-center">
                    <Row gutter={[16, 16]}>
                        <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                        <Col xs={12} md={12} lg={12} xl={12} xxl={12}>
                            <Button onClick={() => this.props.onContinue()}
                                htmlType="button"
                                size="large"
                                className="pop-btn mb-36"
                                style={{ minWidth: 300 }}
                            >
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Tabs.TabPane>
        </Tabs>
    }
}

export default BusinessTransfer;