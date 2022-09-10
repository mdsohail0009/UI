import React, { Component } from "react";
import { Row, Col, Form, Input, Typography, Button, Spin } from 'antd';
import apicalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import { LoadingOutlined } from "@ant-design/icons";

const {  Text } = Typography;
const { TextArea } = Input;
const antIcon = (
    <LoadingOutlined
        style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
        spin
    />
);
class PayeeBankDetails extends Component {
    state = {
        emailExist: false,
        bankDetailForm: React.createRef(),
        countries: [],
        states: [],
        isLoading: false,
        iBanDetals:null,
        IbanLoader:false,
        isValidIban:false
    }

    handleIban = async(ibannumber) =>{
        this.setState({...this.state,iBanDetals:null,IbanLoader:true,isValidIban:false})
        const ibanget = await apicalls.getIBANData(ibannumber)
        if(ibanget.ok){
            if(ibanget.data && (ibanget.data?.routingNumber || ibanget.data?.bankName)){
                const bankdetails = {bankName:ibanget.data.bankName, bic:ibanget.data.bankName, bankBranch:ibanget.data.branch, country:ibanget.data.country, state:ibanget.data.state, city:ibanget.data.city, postalCode:ibanget.data.zipCode, line1:ibanget.data.bankAddress}
                this.setState({...this.state,iBanDetals:bankdetails,IbanLoader:false, isValidIban:true})
                this.props.getIbandata(bankdetails);
            }else{
                this.setState({...this.state,IbanLoader:false, isValidIban:false})
                this.props.getIbandata(null);
            }
        }else{
            this.setState({...this.state,IbanLoader:false, isValidIban:false})
        }
    }
    renderAddress = (transferType) => {
        const _templates = {
            sepa: <>
            <>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name={["payeeAccountModels","iban"]}
                        label={apicalls.convertLocalLang(
                            "Bank_account_iban"
                        )}
                        required
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!value) {
                                        return Promise.reject(apicalls.convertLocalLang("is_required"));
                                    } else if (!this.state.isValidIban) {
                                        return Promise.reject("Invalid Iban");
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ]}
                        onBlur={(e) => {
                            this.handleIban(e.target.value)
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
                 
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name={'reasonOfTransfer'}
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
                {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name={"relation"}
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
                </Col> */}
                </>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                <Spin spinning={this.state.IbanLoader}>
                    {this.state.isValidIban && <div className="box basic-info alert-info-custom mt-16">
                        <Row>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Bank Name</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.bankName||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>BIC</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.bic||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Branch</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.bankBranch||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Country</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.country||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>State</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.state||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>City</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.city||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-14 fw-400 ">
                                    <strong>Zip</strong>
                                </label>
                                <div><Text className="fs-14 fw-400 text-purewhite">{this.state.iBanDetals.postalCode||'---'}</Text></div>

                            </Col>
                        </Row>
                    </div>}
                </Spin>
                </Col>
            </>,
            swift: <>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","accountNumber"]}
                        label={apicalls.convertLocalLang("accountnumber")}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },
                            // {
                            //     validator:(_, value) =>{
                            //         if (this.state.emailExist) {
                            //             return Promise.reject(
                            //                 "Invalid  Bank Account Number"
                            //             );
                            //         } else if (
                            //             value &&
                            //             !/^[A-Za-z0-9]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Invalid  Bank Account Number"
                            //             );
                            //         } else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // },
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
                {this.props.domesticType === "international" &&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","swiftRouteBICNumber"]}
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
                            // {
                            //     validator:(_, value) =>{
                            //         if (this.state.emailExist) {
                            //             return Promise.reject(
                            //                 "Invalid BIC/SWIFT/Routing number"
                            //             );
                            //         } else if (
                            //             value &&
                            //             !/^[A-Za-z0-9]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Invalid BIC/SWIFT/Routing number"
                            //             );
                            //         } else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // },
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

                {this.props.domesticType === "domestic" && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","abaRoutingCode"]}
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
                            // {
                            //     validator:(_, value) =>{
                            //         if (this.state.emailExist) {
                            //             return Promise.reject(
                            //                 "Invalid ACH/Routing number"
                            //             );
                            //         } else if (
                            //             value &&
                            //             !/^[A-Za-z0-9]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Invalid ACH/Routing number"
                            //             );
                            //         } else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // },
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
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","bankName"]}
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
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={"reasonOfTransfer"}
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
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","line1"]}
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
                        className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","line2"]}
                        rules={[
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
                
                {/* <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name={"relation"}
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
                </Col> */}
            </>
        }
        return _templates[transferType]
    }
    render() {
        const { addressType, transferType, onSubmit, bankDetails = {}, emailExist = false, onCancel } = this.props;
        const { countries, states, isLoading } = this.state;
        
        return <>
            <Row gutter={[16, 16]} className={'pb-16'}>
                {this.renderAddress(transferType)}
            </Row>
            </>

    }
}
export default PayeeBankDetails;