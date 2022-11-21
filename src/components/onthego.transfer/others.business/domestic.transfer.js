import { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Form from "antd/lib/form";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import { validateContentRule } from "../../../utils/custom.validator";
const { TextArea } = Input;
class DomesticTransfer extends Component {
  
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
                                    return validateContentRule(_, value)
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
                    className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
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
                                    return validateContentRule(_, value);
                                }
                            },
                        }
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"ABA Routing Code"}
                        maxLength={50}/>

                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
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
                            validator: validateContentRule,
                        },
                       
                    ]}
                >
                    <Input
                        className="cust-input"
                        placeholder={"Bank Name"}
                        maxLength={100}/>

                </Form.Item>
            </Col>
        
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
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
                            validator: validateContentRule,
                        },
                    
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
                    className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
                    name="bankAddress2"
                    rules={[
                        {
                            validator: validateContentRule,
                        },
                       
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
        </Row>
    }
}
export default DomesticTransfer;