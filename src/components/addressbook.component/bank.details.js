import React, { Component } from "react";
import { Row, Col, Form, Input, Select, Button, Spin } from 'antd';
import apicalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
const {TextArea}=Input;
const antIcon = (
    <LoadingOutlined
        style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
        spin
    />
);
class BankDetails extends Component {
    state = {
        emailExist: false,
        bankDetailForm: React.createRef(),
        countries: [],
        states: [],
        isLoading: false
    }
    renderAddress = (transferType) => {
        const _templates = {
            sepa: <>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="payeeAccountCountry"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="Country"
                                component={Form.label}
                            />
                        }
                    >
                        <Select
                            showSearch
                            placeholder={apicalls.convertLocalLang(
                                "select_country"
                            )}
                            className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => {
                                // handleCountryChange(e)
                            }}
                            bordered={false}
                        >
                            {this.state.countries.map((item, indx) => (
                                <Option key={indx} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="payeeAccountState"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="state"
                                component={Form.label}
                            />
                        }
                    >
                        <Select
                            showSearch
                            placeholder={apicalls.convertLocalLang(
                                "select_state"
                            )}
                            className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
                            dropdownClassName="select-drpdwn"
                            onChange={(e) => {//handleStateChange(e)
                            }}
                            bordered={false}
                        >
                            {this.state.states?.map((item, indx) => (
                                <Option key={indx} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="payeeAccountCity"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="city"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder={apicalls.convertLocalLang("city")}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="payeeAccountPostalCode"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                        label={
                            <Translate
                                content="Post_code"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                            className="cust-input"
                            maxLength="20"
                            placeholder={apicalls.convertLocalLang(
                                "Post_code"
                            )}
                        />
                    </Form.Item>
                </Col>
            </>,
            swift:<>
             <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line1"
                        required
                        rules={[
                          {
                            required: true,
                            message: apicalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apicalls.convertLocalLang("is_required"),
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
                          placeholder={apicalls.convertLocalLang("Address_Line1")}
                          className="cust-input cust-text-area address-book-cust"
                          autoSize={{ minRows: 1, maxRows: 2 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                      <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="line2"
                        required
                        rules={[
                          {
                            required: true,
                            message: apicalls.convertLocalLang("is_required"),
                          },
                          {
                            whitespace: true,
                            message: apicalls.convertLocalLang("is_required"),
                          },
                          {
                            validator: validateContentRule,
                          },
                        ]}
                        label={
                          <Translate
                            content="Address_Line2"
                            component={Form.label}
                          />
                        }
                      >
                        <TextArea
                          placeholder={apicalls.convertLocalLang("Address_Line2")}
                          className="cust-input cust-text-area address-book-cust"
                          autoSize={{ minRows: 1, maxRows: 2 }}
                          maxLength={100}
                        ></TextArea>
                      </Form.Item>
                    </Col>
            </>
        }
        return _templates[transferType]
    }
    render() {
        const { addressType, transferType, onSubmit, bankDetails = {}, emailExist = false, onCancel } = this.props;
        const { countries, states, isLoading } = this.state;
        return <Form
            form={this.bankDetailForm}
            onFinish={() => { }}
            autoComplete="off"
            initialValues={bankDetails}
        >
            <Row gutter={[16, 16]}>

                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="swiftCode"
                        label={apicalls.convertLocalLang(
                            transferType === "sepa" ? "bicnumber" : "swiftcode"
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator(_, value) {
                                    if (emailExist) {
                                        return Promise.reject(
                                            "Invalid BIC/SWIFT/Routing number"
                                        );
                                    } else if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            "Invalid BIC/SWIFT/Routing number"
                                        );
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input
                            className="cust-input "
                            placeholder={apicalls.convertLocalLang(
                                transferType === "sepa" ? "bicnumber" : "swiftcode"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>
                {transferType === "swift" && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="routingNumber"
                        label={apicalls.convertLocalLang(
                            "Routing_number"
                        )}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator(_, value) {
                                    if (emailExist) {
                                        return Promise.reject(
                                            "Invalid ACH/Routing number"
                                        );
                                    } else if (
                                        value &&
                                        !/^[A-Za-z0-9]+$/.test(value)
                                    ) {
                                        return Promise.reject(
                                            "Invalid ACH/Routing number"
                                        );
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input
                            className="cust-input "
                            placeholder={apicalls.convertLocalLang(
                                "Routing_number"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>}
                {transferType == "sepa" ? (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="IBAN"
                            label={apicalls.convertLocalLang(
                                "Bank_account_iban"
                            )}
                            required
                            rules={[
                                {
                                    required: true,
                                    message:
                                        apicalls.convertLocalLang("is_required"),
                                },
                                {
                                    validator(_, value) {
                                        if (emailExist) {
                                            return Promise.reject(
                                                "Invalid  IBAN Number"
                                            );
                                        } else if (
                                            value &&
                                            !/^[A-Za-z0-9]+$/.test(value)
                                        ) {
                                            return Promise.reject(
                                                "Invalid  IBAN Number"
                                            );
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                },
                            ]}
                            onBlur={(e) => {
                                //handleIban(e.target.value)
                            }}
                        >
                            <Input
                                className="cust-input"
                                placeholder={apicalls.convertLocalLang(
                                    "Bank_account_iban"
                                )}
                            />
                        </Form.Item>
                    </Col>
                ) : (
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="accountNumber"
                            label={apicalls.convertLocalLang("Bank_account")}
                            required
                            rules={[
                                {
                                    required: true,
                                    message:
                                        apicalls.convertLocalLang("is_required"),
                                },
                                {
                                    validator(_, value) {
                                        if (emailExist) {
                                            return Promise.reject(
                                                "Invalid  Bank Account Number"
                                            );
                                        } else if (
                                            value &&
                                            !/^[A-Za-z0-9]+$/.test(value)
                                        ) {
                                            return Promise.reject(
                                                "Invalid  Bank Account Number"
                                            );
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input
                                className="cust-input"
                                placeholder={apicalls.convertLocalLang(
                                    "Bank_account"
                                )}
                                maxLength="500"
                            />
                        </Form.Item>
                    </Col>
                )}
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="bankName"
                        label={apicalls.convertLocalLang("Bank_name")}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                whitespace: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator: validateContentRule,
                            },
                        ]}
                    >
                        <Input
                            className="cust-input"
                            placeholder={apicalls.convertLocalLang(
                                "Bank_name"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>

                {this.renderAddress(transferType)}
            </Row>
            <div className="text-right mt-12">
                <Button
                    className="pop-btn px-36"
                    style={{ margin: "0 8px" }}
                    onClick={onCancel}
                >
                    {apicalls.convertLocalLang("cancel")}
                </Button>
                <Button
                    htmlType="submit"
                    size="large"
                    className="pop-btn px-36"
                    // loading={btnDisabled}
                    style={{ minWidth: 150 }}
                >
                    {isLoading && <Spin indicator={antIcon} />}{" "}
                    <Translate content="Save_btn_text" />
                </Button>
            </div>
        </Form>

    }
}
export default BankDetails;