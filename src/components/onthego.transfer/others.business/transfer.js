import { Alert, Tabs } from "antd";
import { Form, Row, Col, AutoComplete, Select, Divider, Typography, Input, Button, Image } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import { validateContentRule } from "../../../utils/custom.validator";
import ConnectStateProps from "../../../utils/state.connect";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, createPayee, payeeAccountObj, savePayee } from "../api";
import DomesticTransfer from "./domestic.transfer";
import InternationalTransfer from "./international.transfer";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
const { Option } = Select;
const { Paragraph, Title, Text } = Typography;
class BusinessTransfer extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        isLoading: true,
        details: {},
        selectedTab: "domestic", isBtnLoading: false,
        showDeclaration: false
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee(this.props.userProfile.id, this.props.selectedAddress?.id || "", "business");
        if (response.ok) {
            let data = response.data;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            if (this.props.selectedAddress) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails, line1: data.line1, line2: data.line2, line3: data.line3, bankAddress1: accountDetails.line1, bankAddress2: accountDetails.line2 };
                delete data["documents"];
                // this.handleIbanChange({ target: { value: data?.iban } });
            }
            this.setState({ ...this.state, errorMessage: null, details: data }, () => {
                this.setState({ ...this.state, isLoading: false })
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }

    }
    submitPayee = async (values) => {
        let { details, selectedTab } = this.state;
        let _obj = { ...details, ...values };
        _obj.payeeAccountModels[0].currencyType = "Fiat";
        _obj.payeeAccountModels[0].walletCode = "USD";
        _obj.payeeAccountModels[0].accountNumber = values?.accountNumber;
        _obj.payeeAccountModels[0].bankName = values?.bankName;
        _obj.payeeAccountModels[0].abaRoutingCode = values?.abaRoutingCode;
        _obj.payeeAccountModels[0].swiftRouteBICNumber = values?.swiftRouteBICNumber;
        _obj.payeeAccountModels[0].line1 = values.bankAddress1;
        _obj.payeeAccountModels[0].line2 = values.bankAddress2;
        _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        _obj.addressType = "Business";
        _obj.transferType = selectedTab;
        _obj.amount = this.props.amount;
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        this.setState({ ...this.state, errorMessage: null, isLoading: false, isBtnLoading: true });
        const response = await savePayee(_obj);
        if (response.ok) {
            if (this.props.type != "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer })
                if (confirmRes.ok) {
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                } else {
                    this.setState({ ...this.state, errorMessage: confirmRes.data?.message || confirmRes.data || confirmRes.originalError?.message, isLoading: false, isBtnLoading: false });
                }
            } else {
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false, showDeclaration: true });
            }
        } else {
            this.setState({ ...this.state, details: { ...details, ...values }, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, isBtnLoading: false });
        }
    }
    handleTabChange = (key) => {
        this.setState({ ...this.state, selectedTab: key,errorMessage:null });this.form.current.resetFields();
    }
    render() {
        const { isLoading, details, selectedTab, errorMessage } = this.state;
        if (isLoading) {
            return <Loader />
        }
        if (this.state.showDeclaration) {
            return <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25"><Button onClick={() => this.props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
            </div>
        }
        return <Tabs className="cust-tabs-fait" onChange={this.handleTabChange} activeKey={selectedTab}>
            <Tabs.TabPane tab="Domestic USD transfer" className="text-white text-captz" key={"domestic"}>
                {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row gutter={[4, 4]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label"
                                name="favouriteName"
                                label={"Save Whitelist Name As"}
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
                                    maxLength={20}
                                    className="cust-input"
                                    placeholder={" Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                    </Row>
                    <Translate 
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-8  text-white fw-500 mt-16 px-4" style={{ fontSize: 18 }} 
                    />
                    {/* <Divider /> */}
                    <Row gutter={[4, 4]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                                name="beneficiaryName"
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
                                    "Beneficiary Name"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Beneficiary Name"}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                                name="relation"
                                label={"Relationship To Beneficiary"}
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
                                    placeholder={"Relationship To Beneficiary"}
                                />

                            </Form.Item>
                        </Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-8 px-4 text-white fw-500 mt-36" style={{ fontSize: 18 }}>Recipient's Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <DomesticTransfer type={this.props.type} />
                    <Paragraph className="fw-300 mb-0 pb-4 ml-12 text-white-50 pt-16">Please upload supporting docs for transaction*</Paragraph>
                    <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="text-right mt-12">
                        {/* <Row> */}
                            {/* <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col> */}
                            {/* <Col xs={24} className="text-right"> */}
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: "100%" }}
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                            {/* </Col>
                        </Row> */}
                    </div>
                </Form>
            </Tabs.TabPane>
            <Tabs.TabPane tab="International USD Swift" className="text-captz" key={"international"}>
                {errorMessage && <Alert type="error" description={errorMessage} showIcon />}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row gutter={[4, 4]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label"
                                name="favouriteName"
                                label={"Save Whitelist Name As"}
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
                                    maxLength={20}
                                    className="cust-input"
                                    placeholder={" Save Whitelist Name As"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Paragraph className="mb-8 text-white fw-500 mt-16 px-4" style={{ fontSize: 18 }} >Recipient's Details</Paragraph>
                    {/* <Divider /> */}
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                                name="beneficiaryName"
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
                                    "Beneficiary Name"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Beneficiary Name"}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
                                name="relation"
                                label={"Relationship To Beneficiary"}
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
                                    placeholder={"Relationship To Beneficiary"}
                                />

                            </Form.Item>
                        </Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-8 text-white fw-500 mt-36 px-4" style={{ fontSize: 18 }}>Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <InternationalTransfer type={this.props.type} />
                    <Paragraph className="fw-300 mb-0 pb-4 ml-12 text-white-50 pt-16">Please upload supporting docs for transaction*</Paragraph>
                    <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="align-center">
                        {/* <Row gutter={[16, 16]}> */}
                            {/* <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col> */}
                            {/* <Col xs={24} className="text-right"> */}
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: "100%" }}
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                            {/* </Col>
                        </Row> */}
                    </div>
                </Form>

            </Tabs.TabPane>
        </Tabs>
    }
}

export default ConnectStateProps(BusinessTransfer);