import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Radio, Tabs, Image } from 'antd';
import {createPayee, payeeAccountObj, savePayee} from "../api";
import AddressDocumnet from "../../addressbook.component/document.upload";
import PayeeBankDetails from "./bankdetails.component";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import { Link } from 'react-router-dom';
import apiCalls from "../../../api/apiCalls";
import ConnectStateProps from "../../../utils/state.connect";
const { Paragraph, Text, Title } = Typography;
const { Search } = Input;

const SomeoneComponent = (props) => {
    const [addressOptions, setAddressOptions] = useState({ addressType: "someoneelse", transferType: props.currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic' });
    const [bankdetails, setBankdetails] = useState(null);
    const [createPayeeObj, setCreatePayeeObj] = useState(null);
    const [form]=Form.useForm();
    useEffect(() => {
        getpayeeCreate();
        form.setFieldsValue({ addressType: 'someoneelse', transferType: props.currency === "USD" ? 'sepa' : 'domestic' })
    }, [])
    const getpayeeCreate = async() =>{
        const createPayeeData = await createPayee(props.userProfile.id,'',addressOptions.addressType);
        if(createPayeeData.ok){
            setCreatePayeeObj(createPayeeData.data);
        }
    }
    const onSubmit = async(values) =>{
        // values.payeeAccountModels[0] = {...createPayeeObj.payeeAccountModels,...bankdetails}
        let obj = {...createPayeeObj,...values};
        obj.payeeAccountModels = [payeeAccountObj()];
        obj.payeeAccountModels[0] = {...obj.payeeAccountModels[0],...bankdetails};
        obj.payeeAccountModels[0].currencyType = props.currency;
        obj['customerId'] = props.userProfile.id;
        obj['amount'] = props.onTheGoObj.amount;
        let payeesave = await savePayee(obj)
        if(payeesave.ok){
            console.log(payeesave.data)
        }
        
    }
    const getIbandata = (data) =>{
        setBankdetails(data);
    }
    return (<React.Fragment>
        <>
            <Form
                ref={form}
                onFinish={onSubmit}
                autoComplete="off"
                initialValues={{}}
            >
                {props.currency === "USD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey }); form.resetFields();
                                form.setFieldsValue({ addressType: 'someoneelse', transferType: activekey })
                            }}>
                                <Tabs.TabPane tab="Domestic USD Transfer" className="text-white" key={"domestic"}></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD Swift" className="text-white" key={"international"}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {props.currency == 'EUR' && <h2 style={{ fontSize: 18, textAlign: 'center', color: "white" }}>SEPA transfer</h2>}
                <Row gutter={[16, 16]} className={'pb-16'}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="favouriteName"
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
                                <Translate content={"saveWhitelistnameas"} component={Form.label} />
                            }
                        >
                            <Input
                                className="cust-input"
                                placeholder={apiCalls.convertLocalLang("saveWhitelistnameas")}
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Translate style={{ fontSize: 18 }}
                    content="Beneficiary_Details"
                    component={Paragraph}
                    className="mb-8  text-white fw-500 mt-16"
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
                                name="line2"
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
                                name="line3"
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
                <Paragraph className="mb-8 fw-500 text-white  mt-16" style={{ fontSize: 18 }}>Bank Details</Paragraph>
                <PayeeBankDetails form={form} domesticType={addressOptions?.domesticType} transferType={addressOptions?.transferType} getIbandata={(data)=>getIbandata(data)} />
                <AddressDocumnet title={"please upload supporting documents for transaction "} />
                <div className="text-right mt-12">
                    {/* <Button
                            className="pop-btn px-36"
                            style={{ margin: "0 8px" }}
                            onClick={() => { }}
                        >
                            {apicalls.convertLocalLang("cancel")}
                        </Button> */}
                    <Button
                        htmlType="submit"
                        size="large"
                        className="pop-btn px-36"
                        style={{ minWidth: 150 }}
                    // onClick={() => console.log(form.getFieldsValue())}
                    >
                        <Translate content="continue" />
                    </Button>
                </div>
            </Form>
        </>
    </React.Fragment>)
}
export default ConnectStateProps(SomeoneComponent);