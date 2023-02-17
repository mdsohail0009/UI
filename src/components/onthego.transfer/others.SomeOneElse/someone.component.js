import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Tabs, Image, Alert } from 'antd';
import { createPayee, payeeAccountObj, savePayee, confirmTransaction } from "../api";
import AddressDocumnet from "../../addressbook.component/document.upload";
import PayeeBankDetails from "./bankdetails.component";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls";
import ConnectStateProps from "../../../utils/state.connect";
import Loader from "../../../Shared/loader";
import alertIcon from '../../../assets/images/pending.png';
const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

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
    const [isTabChange, setIsTabChange] = useState(false);
    const [form] = Form.useForm();
    const useDivRef = React.useRef(null);
    const [edit, setEdit] = useState(false);
    const [isSelectedId, setIsSelectedId] = useState(null);
    useEffect(() => {
        getpayeeCreate();
    }, []);//eslint-disable-line react-hooks/exhaustive-deps
    const getpayeeCreate = async () => {
        setMailLoader(true);
        const createPayeeData = await createPayee(props.selectedAddress?.id || "", addressOptions.addressType);
        if (createPayeeData.ok) {
            let edit = false;
            setCreatePayeeObj(createPayeeData.data);
            if (props.selectedAddress?.id) {
                setIntialObj({ ...createPayeeData.data, payeeAccountModels: createPayeeData?.data?.payeeAccountModels[0] })

                setDocuments(createPayeeData?.data?.payeeAccountModels[0]?.docrepoitory)


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
        if (Object.hasOwn(values?.payeeAccountModels, 'iban')) {
            setErrorMessage(null);
            if ((!bankdetails || Object.keys(bankdetails).length === 0)) {
                useDivRef.current.scrollIntoView()
                setErrorMessage("Please click validate button before saving");
                return;
            }
        }
        let obj = { ...createPayeeObj, ...values };
        obj.payeeAccountModels = [payeeAccountObj()];
        obj.payeeAccountModels[0] = { ...obj.payeeAccountModels[0], ...bankdetails, ...values.payeeAccountModels };
        obj.payeeAccountModels[0].currencyType = "Fiat";
        obj.payeeAccountModels[0].docrepoitory = documents;

        obj.payeeAccountModels[0].walletCode = props.currency;
        if (props.selectedAddress?.id) { obj.payeeAccountModels[0].id = createPayeeObj.payeeAccountModels[0].id; }
        obj['customerId'] = props.userProfile.id;
        if (props.type !== "manual") { obj['amount'] = props.onTheGoObj?.amount; }
        obj['transferType'] = props.currency === "USD" ? addressOptions.domesticType : 'sepa';
        obj['addressType'] = addressOptions.addressType;
        if (edit) {
            obj.id = isSelectedId ? isSelectedId : createPayeeObj.payeeAccountModels[0]?.payeeId;
        }
        setBtnLoading(true)

        let payeesave = await savePayee(obj)
        if (payeesave.ok) {
            if (props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: payeesave.data.id, amount: props.onTheGoObj.amount, reasonOfTransfer: obj.reasonOfTransfer, documents: documents })
                if (confirmRes.ok) {
                    setBtnLoading(false);
                    props.onContinue(confirmRes.data);
                } else {
                    setBtnLoading(false);
                    setErrorMessage(isErrorDispaly(confirmRes));
                    useDivRef.current.scrollIntoView();
                }
            } else {
                props.headingUpdate(true);
                setShowDeclartion(true);
                props.isHideTabs(false)
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
        setErrorMessage(null);
        if (data && !data?.bankName) {
            useDivRef.current.scrollIntoView()
            setErrorMessage("No bank details are available for this IBAN number");
            return;
        }
        else if (data) {
            setIsTabChange(false);
            setBankdetails(data);
        }
        else {
            setBankdetails(data);
        }
    }
    return (<React.Fragment>
        {mainLoader && <Loader />}
        {!mainLoader && <>
            <div ref={useDivRef}></div>
            {showDeclartion && <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${props.userProfile?.email}. 
                Please review and sign the document in your email to whitelist your address.
                Please note that your withdrawal will only be processed once the address has been approved by compliance. `}</Text>
            </div></div>}

            {!showDeclartion && <>
                {props.currency === "USD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });
                                form.current.resetFields(); setDocuments(null); setErrorMessage(null); edit ? setIsTabChange(false) : setIsTabChange(true);
                            }}>
                                <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz" key={"domestic"} disabled={edit}></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"} disabled={edit} ></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD IBAN" className="text-white text-captz" key={"internationalIBAN"} disabled={edit}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}

                {props.currency == 'EUR' && <h2 className="adbook-head">SEPA Transfer</h2>}
                {errorMessage && <Alert type="error" showIcon closable={false} description={errorMessage} />}
                <Form
                    ref={form}
                    onFinish={onSubmit}
                    autoComplete="off"
                    initialValues={intialObj}
                    scrollToFirstError
                >

                    <Row className="">
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                    <Translate
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="adbook-head"
                    />
                    <>
                        <Row >
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    className="custom-forminput custom-label"
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
                                        maxLength={100} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    className="custom-forminput custom-label"
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
                                        maxLength={100} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    className="custom-forminput custom-label"
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
                                <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                                <AddressDocumnet documents={documents || null} editDocument={edit} onDocumentsChange={(docs) => {

                                    setDocuments(docs)
                                }} refreshData={addressOptions?.domesticType} />
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    className="custom-forminput custom-label"
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
                                    className="custom-forminput custom-label"
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
                                    className="custom-forminput custom-label"
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
                    <Paragraph className="adbook-head" >Bank Details</Paragraph>
                    {((props.selectedAddress?.id && createPayeeObj) || !props.selectedAddress?.id) &&
                        <PayeeBankDetails GoType={props.ontheGoType} selectedAddress={props.selectedAddress} createPayeeObj={createPayeeObj} form={form} domesticType={addressOptions?.domesticType} transferType={addressOptions?.transferType} getIbandata={(data) => getIbandata(data)} isAddTabCange={isTabChange} />}

                    {props.type !== "manual" &&
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={documents || null} editDocument={edit} onDocumentsChange={(docs) => {
                                setDocuments(docs)
                            }} refreshData={addressOptions?.domesticType} />
                        </React.Fragment>)
                    }

                    <div className="">
                        <Button
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                            loading={btnLoading}
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