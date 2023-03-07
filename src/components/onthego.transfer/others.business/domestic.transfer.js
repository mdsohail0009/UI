import { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { Form, Row, Col, Input } from "antd";
import { validateContentRule } from "../../../utils/custom.validator";
import NumberFormat from "react-number-format";
const { TextArea } = Input;
class DomesticTransfer extends Component {
      validateNumber = (_, validNumberValue) => {
        if (validNumberValue === ".") {
            return Promise.reject("Please enter valid content");
        }
        else if(validNumberValue?.length<6 && validNumberValue !=undefined && validNumberValue !=''){
            return Promise.reject("Invalid Uk Sort Code");
        }
        return Promise.resolve();
    }
   
    render() {
        return <Row >
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                            validator: (_, value) => {
                                if (
                                    value &&
                                    !/^[A-Za-z0-9]+$/.test(value)
                                ) {
                                    return Promise.reject(
                                        "Invalid Account Number"
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
                        placeholder={"Account Number"}
                        maxLength={50}/>

                </Form.Item>
            </Col>
           {this.props.currency != 'GBP' &&this.props.currency != 'CHF' && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
            </Col>}
            {this.props.currency == 'GBP' && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
                name="ukSortCode"
                label="Uk Sort Code"
                className="custom-label"
                type="number"
                rules={[
                    {
                        required: true,
                        message: "Is required",
                    },
                    {
                        validator: this.validateNumber
                    }
                ]}>
                <NumberFormat
                    className="cust-input value-field cust-addon mt-0"
                    customInput={Input}
                    prefix={""}
                    placeholder="Uk Sort Code"
                    allowNegative={false}
                    maxlength={6}
                />
            </Form.Item>
        </Col>}
        {this.props.currency == 'CHF'&&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="swiftRouteBICNumber"
                        label={apiCalls.convertLocalLang(
                            "swifbictcode"
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            },{
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
                            className="cust-input "
                            placeholder={apiCalls.convertLocalLang(
                                "swifbictcode"
                            )}
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>}

            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Form.Item
                    className="custom-forminput custom-label"
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
                    className="custom-forminput custom-label"
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
                    className="custom-forminput custom-label"
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
                    className="custom-forminput custom-label"
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