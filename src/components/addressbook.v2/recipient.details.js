import React, { Component } from "react";
import { Form, Col, Select, AutoComplete, Input } from 'antd'
import Translate from "react-translate-component";
import ConnectStateProps from "../../utils/state.connect";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import BankDetails from '../addressbook.component/bank.details';

const { Option } = Select;
const { TextArea } = Input
class RecipientAddress extends Component {
    render() {
        return <React.Fragment>

            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
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
                    label="Address Line 1"
                >
                    <TextArea
                        placeholder="Address Line 1"
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="line2"
                    rules={[

                        {
                            validator: validateContentRule,
                        }
                    ]}
                    label="Address Line 2"
                >
                    <TextArea
                        placeholder="Address Line 2"
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
                    name="line3"
                    rules={[
                        {
                            validator: validateContentRule,
                        },
                    ]}
                    label="Address Line 3"
                >
                    <TextArea
                        placeholder="Address Line 3"
                        className="cust-input cust-text-area address-book-cust"
                        autoSize={{ minRows: 1, maxRows: 1 }}
                        maxLength={1000}
                    ></TextArea>
                </Form.Item>
            </Col>
        </React.Fragment>
    }
}

class RecipientDetails extends Component {
    state = { emailExist: false, payeeLu: [] }
    render() {
        const { payeeLu } = this.props;
        return <React.Fragment>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName">
                <Form.Item
                    className="fw-300 mb-8 px-4 text-white-50 custom-forminput custom-label"
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
                       
                        maxLength={100}
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
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
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
                        maxLength={100}
                        placeholder={apiCalls.convertLocalLang("first_name")}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
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
                        maxLength={100}
                        placeholder={apiCalls.convertLocalLang("last_name")}
                    />
                </Form.Item>
            </Col>
       
            <RecipientAddress />
            <BankDetails transferType={this.props.transferType} />
        </React.Fragment>
    }
}
export default ConnectStateProps(RecipientDetails);

export {RecipientAddress}