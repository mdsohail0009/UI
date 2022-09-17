import { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { Form, Row, Col, Input } from "antd";
import { validateContentRule } from "../../../utils/custom.validator";
const { TextArea } = Input;
class InternationalTransfer extends Component {


    render() {
        return <Row gutter={[8, 8]}>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
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
                        maxLength={50}/>

                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-4 text-white-50 py-4"
                    name="swiftRouteBICNumber"
                    label={"Swift / BIC Code"}
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
                                        "Invalid Swift / BIC Code"
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
                        placeholder={"Swift / BIC Code"}
                        maxLength={50}/>

                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-4 text-white-50 py-4"
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
                        },{
                            validator: validateContentRule,
                        },
                    //    {
                    //         validator: (_, value) => {
                    //             if (
                    //                 value &&
                    //                 !/^[A-Za-z0-9_.-\s]+$/.test(value)
                    //             ) {
                    //                 return Promise.reject(
                    //                     "Please enter valid content"
                    //                 );
                    //             }else {
                    //                 return Promise.resolve();
                    //             }
                    //         },
                    //     }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"Bank Name"}
                        maxLength={100} />

                </Form.Item>
            </Col>
           
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
                    className="custom-forminput custom-label fw-300 mb-4 text-white-50 py-4"
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
                        },{
                            validator: validateContentRule,
                        },
                    //    {
                    //         validator: (_, value) => {
                    //             if (
                    //                 value &&
                    //                 !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                    //             ) {
                    //                 return Promise.reject(
                    //                     "Invalid Bank Address 1"
                    //                 );
                    //             }else {
                    //                 return Promise.resolve();
                    //             }
                    //         },
                    //     }
                    ]}
                    label={
                        "Bank Address 1"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 1"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-4 text-white-50 py-4"
                    name="bankAddress2"
                    rules={[
                        {
                            validator: validateContentRule,
                        },
                        // {
                        //     validator: (_, value) => {
                        //         if (
                        //             value &&
                        //             !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                        //         ) {
                        //             return Promise.reject(
                        //                 "Invalid Bank Address 2"
                        //             );
                        //         }else {
                        //             return Promise.resolve();
                        //         }
                        //     },
                        // }
                    ]}
                    label={
                        "Bank Address 2"
                    }
                >
                    <TextArea
                        placeholder={"Bank Address 2"}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
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
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>}
        </Row>
    }
}
export default InternationalTransfer;