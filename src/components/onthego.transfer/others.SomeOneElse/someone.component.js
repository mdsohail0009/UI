import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Button, Typography, Tabs, Image, Alert,Select } from 'antd';
import { createPayee, payeeAccountObj, savePayee,getRelationDetails } from "../api";
import AddressDocumnet from "../../addressbook.component/document.upload";
import PayeeBankDetails from "./bankdetails.component";
import { validateContentRule } from "../../../utils/custom.validator";
import Translate from "react-translate-component";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import alertIcon from '../../../assets/images/pending.png';
import { connect } from "react-redux";
const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;
const {Option}=Select;
const SomeoneComponent = (props) => {
    const [addressOptions, setAddressOptions] = useState({ addressType: "individuals", transferType: (props.currency === "EUR" && !"swift") ? "sepa" : props.currency === "CHF"?'chftransfer':"swift", domesticType:props.currency=="SGD" && "SWIFT/BIC" || 'domestic' });
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
    const [rasonDocuments,setReasonDocuments]=useState(null);
    const [isSelectedId, setIsSelectedId] = useState(null);
    const [relationData,setRelationData]=useState([])
    const [selectedRelation,setSelectedRelation]=useState(null);

    useEffect(() => {
        getpayeeCreate();
        getRelationData();
    }, []);//eslint-disable-line react-hooks/exhaustive-deps
    const getpayeeCreate = async () => {
        setMailLoader(true);
        setErrorMessage(null)
        const createPayeeData = await createPayee(props.selectedAddress?.id || "", addressOptions.addressType);
        if (createPayeeData.ok) {
            setErrorMessage(null)
            let edit2 = false;
            setCreatePayeeObj(createPayeeData.data);
            setSelectedRelation(createPayeeData.data.relation)
            if (props.selectedAddress?.id) {
                setIntialObj({ ...createPayeeData.data, payeeAccountModels: createPayeeData?.data?.payeeAccountModels[0] })
                setDocuments(createPayeeData?.data?.payeeAccountModels[0]?.docrepoitory)
                setAddressOptions({ ...addressOptions, domesticType: createPayeeData.data.transferType });
                edit2 = true;
                props?.onEdit(edit2);
                setEdit(true);
                setIsSelectedId(createPayeeData?.data?.id);
            }
            setMailLoader(false)
        } else {
            setMailLoader(false)
            setErrorMessage(apiCalls.isErrorDispaly(createPayeeData))
        }
    }
    const onSubmit = async (values) => {
        setErrorMessage(null)
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
        obj.payeeAccountModels[0].docrepoitory = documents?.payee || documents?.transfer || documents;
        obj.payeeAccountModels[0].walletCode = props.currency;
        obj.payeeAccountModels[0].ukSortCode = values?.payeeAccountModels?.ukSortCode;
        obj.payeeAccountModels[0].accountNumber = values?.payeeAccountModels?.accountNumber;
        obj.payeeAccountModels[0].modifiedBy = edit ? props.userConfig?.userName : null;
        obj.createdBy = props.userConfig?.userName;
        if (props.selectedAddress?.id) { obj.payeeAccountModels[0].id = createPayeeObj.payeeAccountModels[0].id; }
        obj['customerId'] = props.userProfile?.id;
        if (props.type !== "manual") { obj['amount'] = props.onTheGoObj?.amount ||0; }      
        obj['transferType'] = (props.currency == "USD" || props.currency == "GBP") && addressOptions.domesticType || props.currency == "CHF" && 'chftransfer' || props.currency =='SGD' && 'SWIFT/BIC' ||props.currency =='EUR' && 'sepa';
        obj['addressType'] = addressOptions.addressType;
        obj['info'] =JSON.stringify(props?.trackAuditLogData);
        if (edit) {
            obj.id = isSelectedId ? isSelectedId : createPayeeObj.payeeAccountModels[0]?.payeeId;
        }
        setBtnLoading(true)

        let payeesave = await savePayee(obj)
        if (payeesave.ok) {
            setErrorMessage(null)
            if (props.type !== "manual") {
                    setBtnLoading(false);
                    props.onContinue(payeesave.data);
            } else {
                props.headingUpdate(true);
                setShowDeclartion(true);
                props.isHideTabs(false)
                setErrorMessage(null)
            }
        } else {
            setBtnLoading(false);
            setErrorMessage(apiCalls.isErrorDispaly(payeesave));
            useDivRef.current.scrollIntoView();
        }
    
    }
    
    const getIbandata = (data) => {
        setErrorMessage(null);
        if (data && !data?.bankName) {
            useDivRef.current.scrollIntoView()
            setErrorMessage("No bank details are available for this IBAN number");
        }
        else if(data) {
            setIsTabChange(false);
            setBankdetails(data);
        }
        else {
            setBankdetails(data);
        }
    }

    const getRelationData=async()=>{
        let res = await getRelationDetails()
        if(res.ok){
            setRelationData(res.data)
            setErrorMessage(null)
        }else{
            setErrorMessage( apiCalls.isErrorDispaly(res))
           
        }
    }
    const handleRelation=(e)=>{
        setSelectedRelation(e)
        if(!edit){
            form.current.setFieldsValue({others:null})
        }        
    }
    return (<React.Fragment>
        {mainLoader && <Loader />}
        {!mainLoader && <>
            <div ref={useDivRef}></div>
            {showDeclartion && <div className="custom-declaraton align-declaration"> <div className="success-pop text-center declaration-content">
                <Image preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${props.userConfig?.email}. 
                Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved. `}</Text>
            </div></div>}

            {!showDeclartion && <>
                {props.currency === "USD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });
                                form.current.resetFields();setDocuments(null);setErrorMessage(null);edit ? setIsTabChange(false) : setIsTabChange(true);setSelectedRelation(null)
                            }}>
                                <Tabs.TabPane tab="Domestic USD Transfer" className="text-white text-captz" key={"domestic"} disabled={edit}></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD Swift" className="text-white text-captz" key={"international"} disabled={edit} ></Tabs.TabPane>
                                <Tabs.TabPane tab="International USD IBAN" className="text-white text-captz" key={"internationalIBAN"} disabled={edit}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {!showDeclartion && <>
                {(props.currency === "GBP") && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });
                                form.current.resetFields();setDocuments(null);setReasonDocuments(null);setErrorMessage(null);edit ? setIsTabChange(false) : setIsTabChange(true);setSelectedRelation(null)
                            }}>
                                <Tabs.TabPane tab={ props.currency === "GBP" ? `Local ${props.currency} Transfer` : `Swift ${props.currency} Transfer`} className="text-white text-captz" key={"domestic"} disabled={edit}></Tabs.TabPane>
                                <Tabs.TabPane tab={ props.currency === "GBP" ? `International ${props.currency} Transfer` : `IBAN ${props.currency} Transfer`} className="text-white text-captz" key={"internationalIBAN"} disabled={edit}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {!showDeclartion && <>
                {props.currency === "SGD" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });
                                form.current.resetFields();setDocuments(null);setErrorMessage(null);edit ? setIsTabChange(false) : setIsTabChange(true);setSelectedRelation(null)
                            }}>
                                <Tabs.TabPane tab="SGD SWIFT/BIC" className="text-white text-captz" key={"SWIFT/BIC"} disabled={edit}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {!showDeclartion && <>
                {props.currency === "EUR" && <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="">
                            <Tabs activeKey={addressOptions.domesticType} style={{ color: '#fff' }} className="cust-tabs-fait" onChange={(activekey) => {
                                setAddressOptions({ ...addressOptions, domesticType: activekey, tabType: activekey });
                                form.current.resetFields();setDocuments(null);setErrorMessage(null);edit ? setIsTabChange(false) : setIsTabChange(true);setSelectedRelation(null)
                            }}>
                                <Tabs.TabPane tab="SEPA Transfer" className="text-white text-captz" key={"domestic"} disabled={edit}></Tabs.TabPane>
                                <Tabs.TabPane tab="SWIFT Transfer" className="text-white text-captz" key={"swift"} disabled={edit}></Tabs.TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </>}
                {/* {props.currency == 'EUR' && <h2 className="adbook-head">SEPA Transfer</h2>} */}
                {props.currency == 'CHF' && <h2 className="adbook-head">CHF Transfer</h2>}
                {errorMessage && <Alert type="error" showIcon closable={false} description={errorMessage} />}
            <Form
                ref={form}
                onFinish={onSubmit}
                autoComplete="off"
                initialValues={intialObj}
                scrollToFirstError
            >
               
                <Row  className="">
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
                                    maxLength={100}/>
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
                                    maxLength={100}/>
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
                                 <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={apiCalls.convertLocalLang(
                                        "relationtobenificiary"
                                    )}
                                    optionFilterProp="children"
                                    onChange={(e)=>handleRelation(e)}
                                >
                                    {relationData?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select> 
                            </Form.Item>
                        </Col>
                        {selectedRelation=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                            className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                            name="others"
                            required
                            rules={[
                                {whitespace: true,
                                message: "Is required",
                                },
                                {
                                required: true,
                                message: "Is required",
                                },
                                {
                                validator: validateContentRule,
                            },
                            ]}
                            >
                            <Input
                                className="cust-input"
                                maxLength={100}
                                placeholder="Please specify:"
                            />
                            </Form.Item>
                      </Col>}
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                        <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                        <AddressDocumnet documents={documents || null} editDocument={edit} onDocumentsChange={(docs) => {
                            setDocuments(docs)
                            }} refreshData={addressOptions?.domesticType} type={"payee"}/>
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
                        <PayeeBankDetails GoType={props.ontheGoType} selectedAddress={props.selectedAddress} 
                        createPayeeObj={createPayeeObj} form={form} 
                        domesticType={props.currency=='CHF'?'internationalIBAN':addressOptions?.domesticType}
                         transferType={(props.currency === "EUR" && addressOptions?.domesticType=="swift") ? "swift" : addressOptions?.transferType}
                          getIbandata={(data) => getIbandata(data)} isAddTabCange={isTabChange} currency={props.currency} editDocument={edit}/>}

                    {props.type !== "manual" &&
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={documents || null} editDocument={edit} onDocumentsChange={(docs) => {
                                setReasonDocuments(docs)
                            }} refreshData={addressOptions?.domesticType} type={"reasonPayee"}/>
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
        </>}
        </>}
        </>}
    </React.Fragment>)
}

const connectStateToProps = ({userConfig,
}) => {
  return {
    userConfig: userConfig.userProfileInfo,
    trackAuditLogData: userConfig.trackAuditLogData,
  };
};
export default connect(connectStateToProps)(SomeoneComponent);