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
        isValidIban:false,
        enteredIbanData: "",
        isShowValid: false,
        isValidateLoading: false,
        isValidCheck: false,
        ibannumber: null
    }
    componentDidMount(){
        if (this?.props?.selectedAddress?.id && this.props?.createPayeeObj) {
            if (this.props?.createPayeeObj?.payeeAccountModels[0]?.iban) {
                this.handleIban(this.props?.createPayeeObj?.payeeAccountModels[0].iban,"true")
            }
        }
    }
    handleIban = async (ibannumber,isNext) => {
        this.setState({ ...this.state, enteredIbanData: ibannumber, isShowValid: false});
        if (ibannumber?.length > 10 && isNext) {
            this.setState({ ...this.state, iBanDetals: null, IbanLoader: true, isValidIban: true })
            const ibanget = await apicalls.getIBANData(ibannumber)
            if (ibanget.ok) {
                if (ibanget.data && (ibanget.data?.routingNumber || ibanget.data?.bankName)) {
                    const bankdetails = { bankName: ibanget.data.bankName, bic: ibanget.data.routingNumber, bankBranch: ibanget.data.branch, country: ibanget.data.country, state: ibanget.data.state, city: ibanget.data.city, postalCode: ibanget.data.zipCode, line1: ibanget.data.bankAddress }
                    this.setState({ ...this.state, iBanDetals: bankdetails, IbanLoader: false, isValidIban: true, isShowValid: false, isValidateLoading: false })
                    this.props.getIbandata(bankdetails);
                    this.props.form.current?.setFieldsValue({ iban: ibannumber })
                } else {
                    this.setState({ ...this.state, IbanLoader: false, isValidIban: false, isValidateLoading: false })
                    this.props.getIbandata(null);
                }
            } else {
                this.setState({ ...this.state, IbanLoader: false, isValidIban: false, isValidateLoading: false })
            }
        } else {
            this.setState({ ...this.state, enteredIbanData: ibannumber, isShowValid: false, IbanLoader: false, isValidIban: false, isValidateLoading: false })
        }
    }

    onIbanValidate = (e) => {
        if (e?.length > 10) {
            if (e &&!/^[A-Za-z0-9]+$/.test(e)) {
                this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {},isValidateLoading: true});
                this.props.form?.current?.validateFields([["payeeAccountModels","iban"]], this.validateIbanType);
            }
            else {
                this.setState({ ...this.state, isValidCheck: true, isShowValid: false,isValidateLoading: true});
                this.handleIban(e, "true");
            }
        }
        else {
            this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {},isValidateLoading: true});
          this.props.form?.current?.validateFields([["payeeAccountModels","iban"]], this.validateIbanType)
        }
    }

    validateIbanType = (_, value) => {
        this.setState({ ...this.state, isValidateLoading: false, isShowValid: this.state.isShowValid?this.state.isShowValid:false});
        if (!value&&this.state.isShowValid) {
            return Promise.reject("is required");
        } else if (!this.state.isValidIban&&this.state.isShowValid) {
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    renderAddress = (transferType) => {
        const _templates = {
            sepa: <>
            <>
            <Col xs={24} md={14} lg={14} xl={14} xxl={14}>
                       <div className=" custom-btn-error">
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name={["payeeAccountModels","iban"]}
                        label={apicalls.convertLocalLang(
                            "Bank_account_iban"
                        )}
                        required
                        rules={[
                            {
                                validator: this.validateIbanType,
                              },
                        ]}
                        onChange={(e) => {
                            this.handleIban(e.target.value)
                        }}
                    >
                        <Input
                            className="cust-input"
                            placeholder={apicalls.convertLocalLang(
                                "Bank_account_iban"
                            )}
                            maxLength={50}/>
                    </Form.Item>
                    </div>
                    </Col>
                    <Col xs={24} md={10} lg={10} xl={10} xxl={10}>
                       <Button className={`pop-btn dbchart-link fs-14 fw-500`} style={{width:"150px",marginTop:"32px",height:"42px"}}
                                    loading={this.state.isValidateLoading}
                                    onClick={() => this.onIbanValidate(this.state.enteredIbanData)} >
                                    <Translate content="validate" />
                                </Button>
                         
                </Col>
                
                 
                {this.props.GoType == "Onthego" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
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
                        <TextArea
                            placeholder={apicalls.convertLocalLang(
                                "reasiontotransfor"
                            )}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>}
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

                    <div className="box basic-info alert-info-custom mt-16">
                    <Spin spinning={this.state.IbanLoader}>
                    {this.state.isValidIban && <Row>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Bank Name
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.bankName||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    BIC
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.bic||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Branch
                                </label>
                                <div className="pr-24"><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.bankBranch||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Country
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.country||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    State
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.state||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    City
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.city||'---'}</Text></div>

                            </Col>
                            <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                                <label className="fs-12 fw-500 ">
                                    Zip
                                </label>
                                <div><Text className="fs-14 fw-400 text-white">{this.state.iBanDetals?.postalCode||'---'}</Text></div>

                            </Col>
                        </Row>}
                        {!this.state.isValidIban&&<span>No bank details available</span>}
                        </Spin>
                    </div>

                </Col>
            </>,
            swift: <>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","accountNumber"]}
                        label={apicalls.convertLocalLang("accountnumber")}
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },{
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
                            placeholder={apicalls.convertLocalLang(
                                "accountnumber"
                            )}
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>
                {this.props.domesticType === "international" &&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
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
                            placeholder={apicalls.convertLocalLang(
                                "swifbictcode"
                            )}
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>}

                {this.props.domesticType === "domestic" && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","abaRoutingCode"]}
                        label="ABA Routing Code"
                        required
                        rules={[
                            {
                                required: true,
                                message:
                                    apicalls.convertLocalLang("is_required"),
                            },{
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
                            className="cust-input "
                            placeholder="ABA Routing Code"
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>}
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
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
                            placeholder={apicalls.convertLocalLang(
                                "Bank_name"
                            )}
                            maxLength={100}
                        />
                    </Form.Item>
                </Col>
               
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
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
                            },{
                                validator: validateContentRule,
                            },
                            // {
                            //     validator: (_, value) => {
                            //         if (
                            //             value &&
                            //             !/^[a-zA-Z0-9_.-\s]+$/.test(value)
                            //         ) {
                            //             return Promise.reject(
                            //                 "Please enter valid content"
                            //             );
                            //         }else {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // }
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
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
                        name={["payeeAccountModels","line2"]}
                        rules={[{
                            validator: validateContentRule,
                        },
                        //    {
                        //         validator: (_, value) => {
                        //             if (
                        //                 value &&
                        //                 !/^[a-zA-Z0-9_.-\s]+$/.test(value)
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
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col>
                {this.props.GoType == "Onthego" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label fw-300 mb-4 text-white-50 pt-8"
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
                        <TextArea
                            placeholder={apicalls.convertLocalLang(
                                "reasiontotransfor"
                            )}
                            className="cust-input cust-text-area address-book-cust"
                            autoSize={{ minRows: 1, maxRows: 2 }}
                            maxLength={100}
                        ></TextArea>
                    </Form.Item>
                </Col>}
                
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