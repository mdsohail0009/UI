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
import alertIcon from '../../../assets/images/pending.png';
const { Paragraph, Text, Title } = Typography;
const { Search, TextArea } = Input;

const SomeoneComponent = (props) => {
    const [addressOptions, setAddressOptions] = useState({ addressType: "individuals", transferType: props.currency === "EUR" ? "sepa" : "swift", domesticType: 'domestic' });
    const [bankdetails, setBankdetails] = useState(null);
    const [createPayeeObj, setCreatePayeeObj] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [mainLoader, setMailLoader] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeclartion, setShowDeclartion] = useState(false);
    const [intialObj, setIntialObj] = useState(false);
    const [form] = Form.useForm();
    const useDivRef = React.useRef(null);
const [edit,setEdit]=useState(false);
const [isSelectedId,setIsSelectedId] = useState(null);
    useEffect(() => {
        getpayeeCreate();
    }, [])
    const getpayeeCreate = async () => {
        setMailLoader(true);
        const createPayeeData = await createPayee(props.userProfile.id, props.selectedAddress?.id || "", addressOptions.addressType);
        if (createPayeeData.ok) {
            let edit = false;
            setCreatePayeeObj(createPayeeData.data);
            if (props.selectedAddress?.id) {
                // form.current?.setFieldsValue({...createPayeeData.data,payeeAccountModels:createPayeeData.data.payeeAccountModels[0]})
                setIntialObj({ ...createPayeeData.data, payeeAccountModels: createPayeeData.data.payeeAccountModels[0] })
                setDocuments(createPayeeData.data.payeeAccountModels[0].documents)
                setAddressOptions({ ...addressOptions, domesticType: createPayeeData.data.transferType });
                edit = true;
                props?.onEdit(edit);
                setEdit(true);
                setIsSelectedId(createPayeeData?.data?.id);
            }
            setMailLoader(false)

        } else {
            setMailLoader(false)
        }
    }
    const onSubmit = async (values) => {
        let obj = { ...createPayeeObj, ...values };
        obj.payeeAccountModels = [payeeAccountObj()];
        obj.payeeAccountModels[0] = { ...obj.payeeAccountModels[0], ...bankdetails, ...values.payeeAccountModels };
        obj.payeeAccountModels[0].currencyType = "Fiat";
        obj.payeeAccountModels[0].documents = documents;
        obj.payeeAccountModels[0].walletCode = props.currency;
        if (props.selectedAddress?.id) { obj.payeeAccountModels[0].id = createPayeeObj.payeeAccountModels[0].id; }
        obj['customerId'] = props.userProfile.id;
        if (props.type !== "manual") { obj['amount'] = props.onTheGoObj?.amount; }
        obj['transferType'] = props.currency === "USD" ? addressOptions.domesticType : 'sepa';
        obj['addressType'] = addressOptions.addressType;
        if(edit){
            obj.id = isSelectedId ? isSelectedId : createPayeeObj.payeeAccountModels[0]?.payeeId;
        }
        setBtnLoading(true)
        let payeesave = await savePayee(obj)
        if (payeesave.ok) {
            if (props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: payeesave.data.id, amount: props.onTheGoObj.amount, reasonOfTransfer: obj.reasonOfTransfer })
                if (confirmRes.ok) {
                    setBtnLoading(false);
                    props.onContinue(confirmRes.data);
                } else {
                    setBtnLoading(false);
                    setErrorMessage(isErrorDispaly(confirmRes));
                    useDivRef.current.scrollIntoView();
                }
            } else {
                setShowDeclartion(true)
            }
        } else {
            setBtnLoading(false);
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
    const getIbandata = (data) => {
        setBankdetails(data);
    }
    return (<React.Fragment>
        {mainLoader && <Loader />}
        {!mainLoader && <>
            <div ref={useDivRef}></div>
            {showDeclartion && <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${props.userProfile?.email}. 
                   Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                <div className="my-25"><Button onClick={() => props.onContinue({ close: true, isCrypto: false })} type="primary" className="mt-36 pop-btn withdraw-popcancel">BACK</Button></div>
            </div>}

            {!showDeclartion && <>
                {props.currency === "USD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey });
                                form.current.resetFields();
                                // form.current.setFieldsValue({ addressType: 'someoneelse', transferType: activekey })
                            }}>
                                <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz" key={"domestic"} disabled={edit}></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"} disabled={edit} ></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {props.currency == 'EUR' && <h2 className="text-white fw-600" style={{ fontSize: 18, textAlign: 'center'}}>SEPA Transfer</h2>}
                {errorMessage && <Alert type="error" showIcon closable={false} description={errorMessage} />}
            <Form
                ref={form}
                onFinish={onSubmit}
                autoComplete="off"
                initialValues={intialObj}
                scrollToFirstError
            >
               
                <Row gutter={[16, 16]} className={'pb-16'}>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 pt-16"
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
                                maxLength={100}
                                className="cust-input"
                                placeholder={apiCalls.convertLocalLang("saveWhitelistnameas")}
                            />
                        </Form.Item>
                    </Col>

                </Row>
                <Translate style={{ fontSize: 18 }}
                    content="Beneficiary_Details"
                    component={Paragraph}
                    className="mb-8 px-4 text-white fw-500 mt-16"
                />
                <>
                    <Row gutter={[4, 4]}>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                    maxLength={100}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                <TextArea
                                        placeholder={'Address Line 1'}
                                        className="cust-input cust-text-area address-book-cust"
                                        autoSize={{ minRows: 1, maxRows: 2 }}
                                        maxLength={1000}
                                    ></TextArea>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                <TextArea
                                        placeholder={'Address Line 2'}
                                        className="cust-input cust-text-area address-book-cust"
                                        autoSize={{ minRows: 1, maxRows: 2 }}
                                        maxLength={1000}
                                    ></TextArea>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label fw-300 mb-8 px-4 text-white-50 py-4"
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
                                <TextArea
                                        placeholder={'Address Line 3'}
                                        className="cust-input cust-text-area address-book-cust"
                                        autoSize={{ minRows: 1, maxRows: 2 }}
                                        maxLength={1000}
                                    ></TextArea>
                            </Form.Item>
                        </Col>
                    </Row>
                </>
                {/* <Divider /> */}
                <Paragraph className="mb-8 fw-500 text-white px-4 mt-36" style={{ fontSize: 18 }}>Bank Details</Paragraph>
                {((props.selectedAddress?.id && createPayeeObj)||!props.selectedAddress?.id ) &&
                 <PayeeBankDetails GoType={props.ontheGoType} selectedAddress={props.selectedAddress} createPayeeObj={createPayeeObj} form={form} domesticType={addressOptions?.domesticType} transferType={addressOptions?.transferType} getIbandata={(data)=>getIbandata(data)} />}
                
                <Paragraph className="fw-400 mb-0 pb-4 ml-12 text-white pt-16">Please upload supporting docs to explain relationship with beneficiary*</Paragraph>
                {console.log(documents)}
                <AddressDocumnet documents={documents || null} onDocumentsChange={(docs) => {
                        setDocuments(docs)
                    }} />
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
                        className="pop-btn px-36 mt-36"
                        loading={btnLoading}
                        // style={{ minWidth: "100%" }}
                    // onClick={() => console.log(form.getFieldsValue())}
                    >
                        {props.type === "manual" && "Save"}
                        {props.type !== "manual" && <Translate content="continue" />}
                    </Button>
                </div>
            </Form>
        </>}
        </>}
    </React.Fragment>)
}
export default ConnectStateProps(SomeoneComponent);