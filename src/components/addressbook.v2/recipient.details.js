import { Divider } from "antd";
import React, { Component } from "react";
import { Form, Radio, Row, Col, Typography, Select, AutoComplete, Input } from 'antd'
import Translate from "react-translate-component";
import ConnectStateProps from "../../utils/state.connect";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import BankDetails from '../addressbook.component/bank.details';

const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input
class RecipientAddress extends Component {
    render() {
        return <React.Fragment>

            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
                    name="line1"
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
                        <Translate
                            content="Address_Line1"
                            component={Form.label}
                        />
                    }
                >
                    <TextArea
                        placeholder={apiCalls.convertLocalLang("Address_Line1")}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
                    name="line2"
                    rules={[

                        {
                            validator: validateContentRule,
                        }
                    ]}
                    label={
                        <Translate
                            content="Address_Line2"
                            component={Form.label}
                        />
                    }
                >
                    <TextArea
                        placeholder={apiCalls.convertLocalLang("Address_Line2")}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
                    name="line3"
                    rules={[
                        {
                            validator: validateContentRule,
                        },
                    ]}
                    label={
                        <Translate
                            content="Address_Line3"
                            component={Form.label}
                        />
                    }
                >
                    <TextArea
                        placeholder={apiCalls.convertLocalLang("Address_Line3")}
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={100}
                    ></TextArea>
                </Form.Item>
            </Col>
        </React.Fragment>
    }
}

class RecipientDetails extends Component {
    state = { emailExist: false, payeeLu: [] }
    render() {
        const { emailExist, payeeLu } = this.props;
        return <React.Fragment>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12} id="favoriteName">
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label"
                    name="favouriteName"
                    label={
                        "Save Whitelist name as"
                    }
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
                        placeholder={"Save Whitelist name as"}
                    >
                        {payeeLu?.map((item, indx) => (
                            <Option key={indx} value={item.name}>
                                {item.name}
                            </Option>
                        ))}
                    </AutoComplete>
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
                    name="firstName"
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
                        <Translate content={"first_name"} component={Form.label} />
                    }
                >
                    <Input
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("first_name")}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
                    name="lastName"
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
                        <Translate content={"last_name"} component={Form.label} />
                    }
                >
                    <Input
                        className="cust-input"
                        placeholder={apiCalls.convertLocalLang("last_name")}
                    />
                </Form.Item>
            </Col>
            {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    name="email"
                    label={apiCalls.convertLocalLang("email")}
                    className="custom-forminput custom-label mb-0"
                    type="email"
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            validator(_, value) {
                                if (emailExist) {
                                    return Promise.reject("Email already exist");
                                } else if (
                                    value &&
                                    !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,15}(?:\.[a-z]{2})?)$/.test(
                                        value
                                    )
                                ) {
                                    return Promise.reject("Invalid email");
                                } else {
                                    return Promise.resolve();
                                }
                            },
                        },
                    ]}
                >
                    <Input
                        placeholder={apiCalls.convertLocalLang("email")}
                        className="cust-input"
                        maxLength={100}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="phoneNumber"
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },
                        {
                            validator(_, value) {
                                if (emailExist) {
                                    return Promise.reject("Phone number already exist");
                                } else if (
                                    value &&
                                    !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(
                                        value
                                    )
                                ) {
                                    return Promise.reject("Invalid phone number");
                                } else {
                                    return Promise.resolve();
                                }
                            },
                        },
                    ]}
                    label={
                        <Translate content="Phone_No" component={Form.label} />
                    }
                >
                    <Input
                        className="cust-input"
                        maxLength="20"
                        placeholder={apiCalls.convertLocalLang("Phone_No")}
                        allowNegative={false}
                    />
                </Form.Item>
            </Col> */}
            <RecipientAddress />
            <BankDetails transferType={this.props.transferType} />
        </React.Fragment>
    }
}
export default ConnectStateProps(RecipientDetails);

export {RecipientAddress}