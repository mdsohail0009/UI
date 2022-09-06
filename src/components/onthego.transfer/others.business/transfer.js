import { Tabs } from "antd";
import { Form, Row, Col, AutoComplete, Select, Divider, Typography, Input, Button } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import { validateContentRule } from "../../../utils/custom.validator";
import ConnectStateProps from "../../../utils/state.connect";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { createPayee, payeeAccountObj, savePayee } from "../api";
import DomesticTransfer from "./domestic.transfer";
import InternationalTransfer from "./international.transfer";
const { Option } = Select;
const { Paragraph } = Typography;
class BusinessTransfer extends Component {
    form = React.createRef();
    state = {
        errorMessage: null,
        isLoading: true,
        details: {},
        selectedTab: "domestic"
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee(this.props.userProfile.id, "","business");
        if (response.ok) {
            let data = response.data;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            this.setState({ ...this.state, errorMessage: null, details: data }, () => {
                this.setState({ ...this.state, isLoading: false })
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }

    }
    submitPayee = async (values) => {
        let { details,selectedTab } = this.state;
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
        _obj.amount=this.props.amount;
        const response = await savePayee(_obj);
        if (response.ok) {
            this.setState({ ...this.state, errorMessage: null, isLoading: false });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false });
        }

    }
    handleTabChange = (key) => {
        this.setState({ ...this.state, selectedTab: key });
       setTimeout(()=>{ this.form.current.setFieldsValue(this.form.current.getFieldsValue())},500);
    }
    render() {
        const { isLoading, details,selectedTab } = this.state;
        return <Tabs className="cust-tabs-fait" onChange={this.handleTabChange} activeKey={selectedTab}>
            <Tabs.TabPane tab="Domestic USD transfer" className="text-white" key={"domestic"}>
                {!isLoading && <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                    <Paragraph className="mb-8  text-white fw-500 mt-16" style={{ fontSize: 18 }} >Recipient's Details</Paragraph>
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-8  text-white fw-500 mt-16" style={{ fontSize: 18 }}>Recipient's Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <DomesticTransfer />
                    <Paragraph className="mb-8 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>
                    <AddressDocumnet documents={details?.payeeAccountModels[0]?.documents} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="align-center">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}>
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: 300 }}
                                >
                                    Continue
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>}
                {isLoading && <Loader />}
            </Tabs.TabPane>
            <Tabs.TabPane tab="International USD Swift" key={"international"}>
                {!isLoading && <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                    <Paragraph className="mb-8  text-white fw-500 mt-16" style={{ fontSize: 18 }} >Recipient's Details</Paragraph>
                    {/* <Divider /> */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="mb-8 text-white fw-500 mt-16" style={{ fontSize: 18 }}>Recipient's Bank Details</Paragraph>
                    {/* <Divider /> */}
                    <InternationalTransfer />
                    <Paragraph className="mb-8 fs-14 text-white fw-500 mt-16">Please upload supporting docs for transaction</Paragraph>
                    <AddressDocumnet documents={details?.payeeAccountModels[0]?.documents} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} />
                    <div className="align-center">
                        <Row gutter={[16, 16]}>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}></Col>
                            <Col xs={12} md={12} lg={12} xl={12} xxl={12}>
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    className="pop-btn mb-36"
                                    style={{ minWidth: 300 }}
                                >
                                    Continue
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Form>}
                {isLoading && <Loader />}
            </Tabs.TabPane>
        </Tabs>
    }
}

export default ConnectStateProps(BusinessTransfer);