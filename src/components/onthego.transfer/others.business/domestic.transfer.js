import { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { Form, Row, Col, Input } from "antd";
import { validateContentRule } from "../../../utils/custom.validator";
const { TextArea } = Input;
class DomesticTransfer extends Component {
    render() {
        return <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="accountNumber"
                    label={"Account Number"}
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
                        placeholder={"Account Number"}
                    />

                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="abaRoutingCode"
                    label={"ABA Routing Code"}
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
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid ABA Routing Code"
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
                        placeholder={"ABA Routing Code"}
                    />

                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="bankName"
                    label={"Bank Name"}
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
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Bank Name"
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
                        placeholder={"Bank Name"}
                    />

                </Form.Item>
            </Col>
            {this.props.type !== "manual" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                    <TextArea
                        placeholder={"Reason Of Transfer"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>}
            {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
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
            </Col> */}
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="bankAddress1"
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
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Bank Address 1"
                                    );
                                }else {
                                    return Promise.resolve();
                                }
                            },
                        }
                    ]}
                    label={
                        "Bank Address 1"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 1"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="bankAddress2"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Bank Address 2"
                                    );
                                }else {
                                    return Promise.resolve();
                                }
                            },
                        }
                    ]}
                    label={
                        "Bank Address 2"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 2"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>
            
        </Row>
    }
}
export default DomesticTransfer;