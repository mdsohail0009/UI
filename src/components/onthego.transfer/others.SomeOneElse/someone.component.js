import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Radio, Tabs, Image, Alert } from 'antd';
import {createPayee, payeeAccountObj, savePayee, confirmTransaction} from "../api";
import AddressDocumnet from "../../addressbook.component/document.upload";
import PayeeBankDetails from "./bankdetails.component";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import { Link } from 'react-router-dom';
import apiCalls from "../../../api/apiCalls";
import ConnectStateProps from "../../../utils/state.connect";
import Loader from "../../../Shared/loader";
const { Paragraph, Text, Title } = Typography;
const { Search } = Input;

const SomeoneComponent = (props) => {
    const [addressOptions, setAddressOptions] = useState({ addressType: "someoneelse", transferType: props.currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic' });
    const [bankdetails, setBankdetails] = useState(null);
    const [createPayeeObj, setCreatePayeeObj] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [mainLoader, setMailLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [form]=Form.useForm();
    const useDivRef = React.useRef(null);

    useEffect(() => {
        getpayeeCreate();
    }, [])
    const getpayeeCreate = async() =>{
        setMailLoader(true)
        const createPayeeData = await createPayee(props.userProfile.id,'',addressOptions.addressType);
        if(createPayeeData.ok){
            setCreatePayeeObj(createPayeeData.data);
            setMailLoader(false)
        }else{
            setMailLoader(false)
        }
    }
    const onSubmit = async(values) =>{
        let obj = {...createPayeeObj,...values};
        obj.payeeAccountModels = [payeeAccountObj()];
        obj.payeeAccountModels[0] = {...obj.payeeAccountModels[0],...bankdetails,...values.payeeAccountModels};
        obj.payeeAccountModels[0].currencyType = "Fiat";
        obj.payeeAccountModels[0].documents = documents;
        obj.payeeAccountModels[0].walletCode = props.currency;
        obj['customerId'] = props.userProfile.id;
        obj['amount'] = props.onTheGoObj.amount;
        obj['transferType'] = props.currency === "USD" ? addressOptions.domesticType:'sepa' ;
        obj['addressType'] = addressOptions.addressType ;
        setBtnLoading(true)
        let payeesave = await savePayee(obj)
        if(payeesave.ok){
            const confirmRes = await confirmTransaction({ payeeId: payeesave.data.id, amount: props.onTheGoObj.amount, reasonOfTransfer: obj.reasonOfTransfer })
            if (confirmRes.ok) {
                setBtnLoading(false);
                props.onContinue(confirmRes.data);
            } else {
                setBtnLoading(false);
                setErrorMessage(isErrorDispaly(confirmRes));
                useDivRef.current.scrollIntoView();
            }
        }else{
            setBtnLoading(true);
            setErrorMessage(isErrorDispaly(payeesave));
            useDivRef.current.scrollIntoView();
        }
        
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
          return objValue.data;
        } else if (
          objValue.originalError &&
          typeof objValue.originalError.message === "string"
        ) {
          return objValue.originalError.message;
        } else {
          return "Something went wrong please try again!";
        }
      };
    const getIbandata = (data) =>{
        setBankdetails(data);
    }
    return (<React.Fragment>
        <div ref={useDivRef}></div>
        
        {errorMessage && <Alert type="error" showIcon closable={false} message={"An error occured"} description={errorMessage} />}
        <>
                {props.currency === "USD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey }); form.resetFields();
                                form.setFieldsValue({ addressType: 'someoneelse', transferType: activekey })
                            }}>
                                <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz" key={"domestic"}></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {props.currency == 'EUR' && <h2 style={{ fontSize: 18, textAlign: 'center', color: "white" }}>SEPA transfer</h2>}
                {mainLoader && <Loader />}
        {!mainLoader && <>
            <Form
                ref={form}
                onFinish={onSubmit}
                autoComplete="off"
                initialValues={{}}
                scrollToFirstError
            >
               
                <Row gutter={[16, 16]} className={'pb-16'}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                                maxLength={20}
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
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                                name={"relation"}
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
                                    <Translate
                                        content="relationtobenificiary"
                                        component={Form.label}
                                    />
                                }
                            >
                                <Input
                                    className="cust-input"
                                    placeholder={apiCalls.convertLocalLang(
                                        "relationtobenificiary"
                                    )}
                                    maxLength="500"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
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
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                                name="line2"
                                rules={[
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
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label text-upper fw-300 mb-4 text-white-50 pt-8"
                                name="line3"
                                rules={[
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
                <Paragraph className="mb-0 fs-14 text-white fw-500 mt-24">Please upload supporting docs for transaction*</Paragraph>
                <AddressDocumnet documents={documents || null} onDocumentsChange={(docs) => {
                        setDocuments(docs)
                    }}/>
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
                        loading={btnLoading}
                        style={{ minWidth: 150 }}
                    // onClick={() => console.log(form.getFieldsValue())}
                    >
                        <Translate content="continue" />
                    </Button>
                </div>
            </Form>
        </>}
        </>
    </React.Fragment>)
}
export default ConnectStateProps(SomeoneComponent);