
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Typography, Select, AutoComplete, Input, Tabs, Button } from 'antd'
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls"
import { validateContentRule } from "../../../utils/custom.validator";
import { connect } from "react-redux";


const { Option } = Select;
const { Text } = Typography;
const MyselfNewTransfer = ({ currency, accountType, ...props }) => {
    const [form] = Form.useForm();
    const [addressOptions, setAddressOptions] = useState({ addressType: "myself", transferType: currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic', tabType: 'domestic' });
    const [payeeLu,setpayeeLu] = useState([])
    const [bankDetails,setbankDetails]=useState({})
    useEffect(() => {
        getPayeeLu()
    }, [])
    const getPayeeLu = async () => {
        const response = await apiCalls.getPayeeLu(props?.userConfig?.id,currency);
        if (response.ok) {
            setpayeeLu(response.data)
        }
    }
    const saveTransfer = () => {

    }
    const getBankDeails = async (e) => {
        const response = await apiCalls.getIBANData(e.target.value);
        if (response.ok) {
            setbankDetails(response.data)
        }
    }
    return <>
        <Form layout="vertical" form={form} onFinish={saveTransfer} initialValues={{}}>
       <> {currency === "USD" && <>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                    <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => { setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey }); }}>
                        <Tabs.TabPane tab="Domestic USD Transfer" className="text-white"  key={"domestic"}></Tabs.TabPane>
                        <Tabs.TabPane tab="International USD Swift" className="text-white" key={"international"}></Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </>}

        {currency == 'EUR' && <h2 style={{ fontSize: 18, textAlign: 'center', color: "white" }}>SEPA transfer</h2>}
        <Row gutter={[16, 16]}><Col xs={24} md={24} lg={24} xl={24} xxl={24} id="favoriteName">
            <Form.Item
                className="custom-forminput custom-label mb-0"
                name="favouriteName"
                label={
                    "Save Whitelist Name As"
                }
                
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
                    placeholder={"Save Whitelist Name As"}
                >
                    {payeeLu?.map((item, indx) => (
                        <Option key={indx} value={item.name}>
                            {item.name}
                        </Option>
                    ))}
                </AutoComplete>
            </Form.Item>
        </Col>
            {currency == 'EUR' && !accountType && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                <Form.Item
                    className="custom-forminput custom-label mb-0"
                    name="IBAN"
                    required
                    rules={[
                        {
                            required: true,
                            message: apiCalls.convertLocalLang("is_required"),
                        },{
                            pattern: /^[A-Za-z0-9]+$/,
                            message: "Invalid IBAN number",
                        },
                    ]}
                    label='IBAN'
                >
                    <Input
                        className="cust-input"
                        placeholder='IBAN'
                    onBlur={(e)=>getBankDeails(e)}/>
                </Form.Item>
            </Col>}</Row>
        <h2 style={{ fontSize: 18, color: "white" }} className="mt-16">Recipient's details</h2>

        <div className="box basic-info alert-info-custom mt-16">
            <Row>
                {!accountType && <><Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>First Name</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                </Col>
                    <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                        <label className="fs-14 fw-400 ">
                            <strong>Last Name</strong>
                        </label>
                        <div><Text className="fs-14 fw-400 text-purewhite">XS</Text></div>

                    </Col></>}
                {accountType && <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Beneficiary Name</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">XXX</Text></div>

                </Col>}
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
        </div>

        <h2 style={{ fontSize: 18, color: "white" }} className="mt-16">Bank details</h2>
        {currency == 'EUR' && accountType && <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
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
        </Col>}
        <Row gutter={[16, 16]}>
            {currency == 'USD' && <> <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
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
                        label={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
                        required
                        rules={[
                            {
                                required: true,
                                message: apiCalls.convertLocalLang("is_required"),
                            }
                        ]}>
                        <Input
                            className="cust-input"
                            placeholder={currency == 'USD' && addressOptions.tabType == 'international' ? 'Swift / BIC code' : 'ABA Routing Code'}
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
        </Row>
        {currency == 'EUR' && <div className="box basic-info alert-info-custom mt-16">
            {bankDetails.bankName!=''&&bankDetails.bankName!=null&&<Row>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                <label className="fs-14 fw-400 ">
                    <strong>Bank Name</strong>
                </label>
                <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails.bankName!=''&&bankDetails.bankName!=null)?bankDetails.bankName:'-'}</Text></div>

            </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>BIC</strong>
                    </label>
                   <div><Text className="fs-14 fw-400 text-purewhite"> {bankDetails.routingNumber!=''&&bankDetails.routingNumber!=null?bankDetails.routingNumber:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Branch</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.branch!=''&&bankDetails.branch!=null?bankDetails.branch:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Country</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.country!=''&&bankDetails.country!=null?bankDetails.country:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>State</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{bankDetails.state!=''&&bankDetails.state!=null?bankDetails.state:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>City</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails.city!=''&&bankDetails.city!=null)?bankDetails.city:'-'}</Text></div>

                </Col>
                <Col xs={24} md={8} lg={24} xl={8} xxl={8} className="mb-16">
                    <label className="fs-14 fw-400 ">
                        <strong>Zip</strong>
                    </label>
                    <div><Text className="fs-14 fw-400 text-purewhite">{(bankDetails.zipCode!=''&&bankDetails.zipCode!=null)?bankDetails.zipCode:'-'}</Text></div>

                </Col></Row>}
                {(bankDetails.bankName==''||bankDetails.bankName==null)&&<span>No bank details available</span>}
        </div>}
        <div className="text-right mt-12">
            <Button
                htmlType="button"
                size="large"
                className="pop-btn px-36"
                style={{ minWidth: 150 }}
               
            >
                <Translate content="continue" />
            </Button>
        </div></></Form>
    </>

}
const connectStateToProps = ({userConfig,
  }) => {
    return {
      userConfig: userConfig.userProfileInfo
    };
  };
export default connect(connectStateToProps)(MyselfNewTransfer);