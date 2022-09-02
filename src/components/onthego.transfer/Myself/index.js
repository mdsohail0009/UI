import { Divider } from "antd";
import React, { Component, useEffect, useState } from "react";
import { Form, Radio, Row, Col, Typography, Select, AutoComplete, Input,Tabs } from 'antd'
import Translate from "react-translate-component";
import ConnectStateProps from "../../../utils/state.connect";
import apiCalls from "../../../api/apiCalls"
import { validateContentRule } from "../../../utils/custom.validator";


const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TextArea } = Input
const MyselfNewTransfer =({currency,transferType,...props})=> {
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType:currency === "EUR" ? "sepa" : "swift", domesticType:'domestic',tabType:'domestic' });
   const [payeeLu]=useState([])
   useEffect(() => {
   console.log(currency,transferType)
}, []);
        return <React.Fragment>
            {currency === "USD" && <>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                        <Tabs style={{ color: '#fff' }} onChange={(activekey) => { setAddressOptions({ ...addressOptions, domesticType: activekey,tabType:activekey }); props.form.resetFields() }}>
                            <Tabs.TabPane tab="Domestic USD Transfer" className="text-white" key={"domestic"}></Tabs.TabPane>
                            <Tabs.TabPane tab="International USD Swift" className="text-white" key={"international"}></Tabs.TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </>}

            {currency=='EUR'&&<strong style={{fontSize:18,textAlign:'center',color:"white"}}>SEPA Transfer</strong>}
            <Row><Col xs={24} md={12} lg={12} xl={12} xxl={12} id="favoriteName">
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="favouriteName"
                    label={
                        "Save Whitelist name as"
                    }
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
                    <AutoComplete
                        onChange={(e) => { }}
                        maxLength={20}
                        className="cust-input"
                        placeholder={"Save Whitelist name as"}
                    >
                        {payeeLu?.map((item, indx) => (
                            <Option key={indx} value={item.name}>
                                {item.name}
                            </Option>
                        ))}
                    </AutoComplete>
                </Form.Item>
            </Col>
            {currency=='EUR'&&<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="IBAN"
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        }
                    ]}
                    label='IBAN'
                >
                    <Input
                        className="cust-input"
                        placeholder='IBAN'
                    />
                </Form.Item>
            </Col>}</Row>
            <strong style={{fontSize:16,color:"white"}}>Recipient's Details</strong>
            <Row>
            <div className="box basic-info alert-info-custom mt-16">
                <Row><Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>First Name</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Last Name</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Address Line 1</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Address Line 2</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Address Line 3</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                   </Row>
                </div> </Row>
            <strong style={{fontSize:16,color:"white"}}>Bank Details</strong>
            <Row>
            {currency=='USD'&&<> <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="Account Number"
                        label='Account Number' required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}
                    >
                        <Input
                            className="cust-input"
                            placeholder='Account Number'
                        />
                    </Form.Item>
                </Col>
               
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="BIC"
                        label={currency=='USD'&&addressOptions.tabType=='international'?'Swift / BIC code':'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency=='USD'&&addressOptions.tabType=='international'?'Swift / BIC code':'ABA Routing Code'}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="Bank Name"
                        label='Bank Name'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder='Bank Name'
                        />
                    </Form.Item>
                </Col>
               
                
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="Bank Address1"
                        label='Bank Address 1'
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder='Bank Address 1'
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                    <Form.Item
                        className="custom-forminput custom-label mb-0"
                        name="Bank Address2"
                        label='Bank Address 2'
                    >
                        <Input
                            className="cust-input"
                            placeholder='Bank Address 2'
                        />
                    </Form.Item>
                </Col></>}
                {currency=='EUR'&& <div className="box basic-info alert-info-custom mt-16">
                <Row><Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Bank Name</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">Barcslays Bank UK PLC</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>BIC</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">BUKBGB22</Text></div>

                    </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Branch</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">CHELTENHAM</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Country</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">United Kingdom(UK)</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>State</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>City</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">Leicester</Text></div>

                    </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Zip</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">LE87 2BB</Text></div>

                    </Col></Row>
                </div>}
                </Row>

        </React.Fragment>
    
}
export default ConnectStateProps(MyselfNewTransfer);