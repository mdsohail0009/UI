import React, { useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Radio, Divider, Image } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import BankDetails from "../addressbook.component/bank.details";
import { validateContentRule } from "../../utils/custom.validator";
import success from '../../assets/images/success.png';
import Translate from "react-translate-component";
import { Link } from 'react-router-dom';
import { useForm } from "antd/lib/form/Form";
import apiCalls from "../../api/apiCalls";
const { Paragraph, Text, Title } = Typography;
const { Search } = Input;

const SomeoneComponent=({ onSubmit, onAddressOptionsChange, PayeeLu = [], emailExist = false, countries = [], states = [], fiatAddress, ...props })=>{
    const [form] = useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: props.currency === "EUR" ? "sepa" : "domestic" });
    const [isCCSP, setCCSP] = useState(false);
    
        return (<React.Fragment>
            <>
                <Form
                    form={form}
                    onFinish={onSubmit}
                    autoComplete="off"
                    initialValues={fiatAddress}
                >
                    {props.currency === "USD" && <Form.Item>
                        <Row gutter={[16, 16]}>

                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                                <Radio.Group
                                    defaultValue={addressOptions.transferType}
                                    className="mb-16 custom-radio-btn buysell-toggle crypto-toggle"
                                    onChange={(value) => {
                                        setAddressOptions({ ...addressOptions, transferType: value.target.value })
                                        // onAddressOptionsChange({ ...addressOptions, transferType: value.target.value });
                                        if (value.target.value === "international" && addressOptions.addressType !== "business") {
                                            setCCSP(true);
                                        } else {
                                            setCCSP(false);
                                        }
                                    }}
                                >
                                    <Radio.Button value="domestic" className="span-text">Domestic USD Transfer</Radio.Button>
                                    <Radio.Button value="international" className="span-text">International USD Swift</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                       
                    </Form.Item>}
                    <Translate
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-16 fs-14 text-white fw-500"
                    />
                    <>
                    <Row gutter={[16, 16]}>
                    <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
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
                                className="custom-forminput custom-label mb-0"
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
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="addressline1"
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
                                    "Address Line 1"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Address Line 1"}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="addressline1"
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
                                    "Address Line 2"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Address Line 2"}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="addressline1"
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
                                    "Address Line 3"
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={"Address Line 3"}
                                />
                            </Form.Item>
                        </Col>
                        </Row>
                    </>
                    {/* <Divider /> */}
                    <Paragraph className="mb-16 fs-14 fw-500 text-white  mt-16">Bank Details</Paragraph>
                    <BankDetails transferType={addressOptions?.transferType} />
                    <AddressDocumnet title={"please upload supporting documents for transaction "} />
                    <div className="text-right mt-12">
                        <Button
                            className="pop-btn px-36"
                            style={{ margin: "0 8px" }}
                            onClick={() => { }}
                        >
                            {apicalls.convertLocalLang("cancel")}
                        </Button>
                        <Button
                            htmlType="button"
                            size="large"
                            className="pop-btn px-36"
                            style={{ minWidth: 150 }}
                            onClick={() => this.chnageStep("reviewdetails")}
                        >
                            <Translate content="Save_btn_text" />
                        </Button>
                    </div>
                </Form>
            </>
        </React.Fragment>)
}
export default SomeoneComponent;