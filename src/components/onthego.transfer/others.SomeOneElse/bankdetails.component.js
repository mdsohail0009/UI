import React, { Component } from "react";
import { Row, Col, Form, Input, Typography, Button, Spin,Alert } from 'antd';
import apicalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import NumberFormat from "react-number-format";
const {  Text } = Typography;
const { TextArea } = Input;

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
        ibannumber: null,
        errorMessage:null
    }
    componentDidMount(){
        if (this?.props?.selectedAddress?.id && this.props?.createPayeeObj) {
            if (this.props?.createPayeeObj?.payeeAccountModels[0]?.iban) {
                this.handleIban(this.props?.createPayeeObj?.payeeAccountModels[0].iban,"true")
            }
        }
    }
    handleIban = async (ibannumber,isNext) => {
        this.props.getIbandata(null);
        if (ibannumber?.length >= 10 && isNext) {
            this.setState({ ...this.state, iBanDetals: null, IbanLoader: true, isValidIban: true, enteredIbanData: ibannumber,  isShowValid: false,isValidateLoading:true,errorMessage:null})
            const ibanget = await apicalls.getIBANData(ibannumber)
            if (ibanget.ok) {
                if (ibanget.data && (ibanget.data?.routingNumber || ibanget.data?.bankName)) {
                    const bankdetails = { bankName: ibanget.data.bankName, bic: ibanget.data.routingNumber, bankBranch: ibanget.data.branch, country: ibanget.data.country, state: ibanget.data.state, city: ibanget.data.city, postalCode: ibanget.data.zipCode, line1: ibanget.data.bankAddress }
                    this.setState({ ...this.state, iBanDetals: bankdetails, enteredIbanData: ibannumber, IbanLoader: false, isValidIban: true, isShowValid: false, isValidateLoading: false, isValidCheck: true,errorMessage:null })
                    this.props.getIbandata(bankdetails);
                    this.props.form.current?.setFieldsValue({ iban: ibannumber })
                } else {
                    this.setState({ ...this.state, IbanLoader: false, isValidIban: false, isValidateLoading: false,errorMessage:null })
                    const bankData = {bankName: "", routingNumber: ""}
                    this.props.getIbandata(bankData);
                }
            } else {
                this.setState({ ...this.state, IbanLoader: false, isValidIban: false, isValidateLoading: false,errorMessage:apicalls.isErrorDispaly(ibanget) })
                this.props.getIbandata(null);
            }
        } else {
            this.props.form.current?.setFieldsValue({ iban: ibannumber })
            this.setState({ ...this.state, enteredIbanData: ibannumber, isShowValid: false, IbanLoader: false, isValidIban: false, isValidateLoading: false,errorMessage:null })
        }
    }

    onIbanValidate = (e) => {
        if (e?.length >= 10) {
            if (e &&!/^[A-Za-z0-9]+$/.test(e)) {
                this.setState({ ...this.state,isValidateLoading: true, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}});
                this.props.getIbandata(null);
                this.props.form?.current?.validateFields([["payeeAccountModels","iban"]], this.validateIbanType);
            }
            else {
                this.setState({ ...this.state, isValidCheck: true, isShowValid: false,isValidateLoading: true});
                this.handleIban(e, "true");
            }
        }
        else {
            this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {},isValidateLoading: true});
            this.props.getIbandata(null);
            this.props.form?.current?.validateFields([["payeeAccountModels","iban"]], this.validateIbanType)
        }
    }

    validateIbanType = (_, value) => {
        this.setState({ ...this.state, isValidateLoading: false, isShowValid: this.state.isShowValid?this.state.isShowValid:false});
        if ((!value&&this.state.isShowValid)||!value) {
            return Promise.reject("Is required");
        } else if ((!this.state.isValidIban&&this.state.isShowValid)|| value?.length < 10) {
            this.props.getIbandata(null);
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            this.props.getIbandata(null);
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    validateNumber = (_, validNumberValue) => {
        if (validNumberValue === "." || validNumberValue &&
        !/^[A-Za-z0-9]+$/.test(validNumberValue)) {
            return Promise.reject("Please enter valid content");
        }
        else if(validNumberValue?.length<6 && validNumberValue !=undefined && validNumberValue !=''){
            return Promise.reject("Invalid Uk Sort Code");
        }
        return Promise.resolve();
    }
    renderAddress = (transferType) => {
        const _templates = {
            sepa: <>
            <>
            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                       <div className=" custom-btn-error fsdf">
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
                            className="cust-input ibanborder-field"
                            placeholder={apicalls.convertLocalLang(
                                "Bank_account_iban"
                            )}
                            maxLength={50}
                            addonAfter={ <Button className={``}
                            type="primary"
                               loading={this.state.isValidateLoading}
                               onClick={() => this.onIbanValidate(this.props?.form.current?.getFieldValue(["payeeAccountModels","iban"]))} >
                           <Translate content="validate" />
                   </Button>  }
                            />
                    </Form.Item>
                    </div>
                    </Col>
                   
                </>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>

                    <div className="box basic-info alert-info-custom mt-16 kpi-List">
                    <Spin spinning={this.state.IbanLoader}>
                    {this.state.isValidIban && !this.props?.isAddTabCange && <Row>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Bank Name
                                </label>
                                <div className=""><Text className="kpi-val">{this.state.iBanDetals?.bankName||'---'}</Text></div>
                            </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    BIC
                                </label>
                                <div className=""><Text className="kpi-val">{this.state.iBanDetals?.bic||'---'}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Branch
                                </label>
                                <div className=""><Text className="kpi-val">{this.state.iBanDetals?.bankBranch||'---'}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Country
                                </label>
                                <div><Text className="kpi-val">{this.state.iBanDetals?.country||'---'}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    State
                                </label>
                                <div><Text className="kpi-val">{this.state.iBanDetals?.state||'---'}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    City
                                </label>
                                <div><Text className="kpi-val">{this.state.iBanDetals?.city||'---'}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Zip
                                </label>
                                <div><Text className="kpi-val">{this.state.iBanDetals?.postalCode||'---'}</Text></div>
                                </div>
                            </Col>
                        </Row>}
                        {(!this.state.isValidIban || this.props?.isAddTabCange)&&<span className="info-details">No bank details available</span>}
                        </Spin>
                    </div>

                </Col>
                {this.props.GoType === "Onthego" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
            </>,
            swift: <>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                {(this.props.domesticType === "international" && this.props.currency != 'GBP') && (this.props.currency === 'USD' && this.props.domesticType === "international") &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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

          { this.props.currency ==='CHF' &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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

                {this.props.domesticType === "domestic"  && this.props.currency != 'GBP' && this.props.currency != 'CHF'&& <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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

              {this.props.currency == 'GBP' &&<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item
               // name="ukSortCode"
               name={["payeeAccountModels","ukSortCode"]}
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


                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
                        className="custom-forminput custom-label"
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
                        className="custom-forminput custom-label"
                        name={["payeeAccountModels","line2"]}
                        rules={[{
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
                            maxLength={1000}
                        ></TextArea>
                    </Form.Item>
                </Col>
                {this.props.GoType === "Onthego" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
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
        const {  transferType,   domesticType } = this.props;
   
        
        return <>
        {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
            <Row className="validateiban-content">
                {this.renderAddress(domesticType === "internationalIBAN" ? "sepa" : transferType)}
            </Row>
            </>

    }
}
export default PayeeBankDetails;