import React, { Component } from "react";
import { Row, Col, Form, Input, Typography } from 'antd';
import apicalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import Translate from "react-translate-component";

const {  Text } = Typography;
const { TextArea } = Input;

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
            <>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                    if (this.state.emailExist) {
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
                      
                    >
                        <Input
                            className="cust-input"
                            placeholder={apicalls.convertLocalLang(
                                "Bank_account_iban"
                            )}
                            maxLength="20"
                        />
                    </Form.Item>
                </Col>
                 
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="reasiontotransfor"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                                className="cust-input"
                                placeholder={apicalls.convertLocalLang(
                                    "reasiontotransfor"
                                )}
                                maxLength="500"
                            />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="relationtobenificiary"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                                className="cust-input"
                                placeholder={apicalls.convertLocalLang(
                                    "reasiontotransfor"
                                )}
                                maxLength="500"
                            />
                    </Form.Item>
                </Col>
                </>
                <div className="box basic-info alert-info-custom mt-16  kpi-List">
                <Row>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>Bank Name</strong>
                        </label>
                        <div><Text className="kpi-val">Barcslays Bank UK PLC</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>BIC</strong>
                        </label>
                        <div><Text className="kpi-val">BUKBGB22</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>Branch</strong>
                        </label>
                        <div><Text className="kpi-val">CHELTENHAM</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>Branch</strong>
                        </label>
                        <div><Text className="kpi-val">CHELTENHAM</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>Country</strong>
                        </label>
                        <div><Text className="kpi-val">United Kingdom (GB)</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>State</strong>
                        </label>
                        <div><Text className="kpi-val">XXXX</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>City</strong>
                        </label>
                        <div><Text className="kpi-val">Leicester</Text></div>
                        </div>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                    <div className="kpi-divstyle">
                        <label className="kpi-label">
                            <strong>Zip</strong>
                        </label>
                        <div><Text className="kpi-val">LE87 2BB</Text></div>
                        </div>
                    </Col>
                </Row>
            </div>
            </>,
            swift: <>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="accountNumber"
                        label={apicalls.convertLocalLang("accountnumber")}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            {
                                validator(_, value) {
                                    if (this.state.emailExist) {
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
                                "accountnumber"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>
                {this.props.domesticType === "international" &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="swiftCode"
                        label={apicalls.convertLocalLang(
                            "swifbictcode"
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
                                    if (this.state.emailExist) {
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
                                "swifbictcode"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>}

                {this.props.domesticType === "domestic" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                    if (this.state.emailExist) {
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
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="bankaddressline1"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apicalls.convertLocalLang("bankaddressline1")}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="bankaddressline2"
                                component={Form.label}
                            />
                        }
                    >
                        <TextArea
                            placeholder={apicalls.convertLocalLang("bankaddressline2")}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="reasiontotransfor"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                            className="cust-input"
                            placeholder={apicalls.convertLocalLang(
                                "reasiontotransfor"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                                content="relationtobenificiary"
                                component={Form.label}
                            />
                        }
                    >
                        <Input
                            className="cust-input"
                            placeholder={apicalls.convertLocalLang(
                                "reasiontotransfor"
                            )}
                            maxLength="500"
                        />
                    </Form.Item>
                </Col>
            </>
        }
        return _templates[transferType]
    }
    render() {
        const { transferType } = this.props;
        
        return <>
            <Row gutter={[16, 16]} className={'pb-16'}>
                {this.renderAddress(transferType)}
            </Row>
            </>

    }
}
export default BankDetails;