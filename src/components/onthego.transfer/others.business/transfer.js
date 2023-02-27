import { Form, Row, Col, Typography, Input, Button, Image, Spin, Alert, Tabs } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import { validateContentRule } from "../../../utils/custom.validator";
import ConnectStateProps from "../../../utils/state.connect";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, payeeAccountObj, savePayee, fetchIBANDetails } from "../api";
import DomesticTransfer from "./domestic.transfer";
import InternationalTransfer from "./international.transfer";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
import apicalls from "../../../api/apiCalls";
import NumberFormat from "react-number-format";
import PayeeBankDetails from "../others.SomeOneElse/bankdetails.component";
const { Paragraph, Title, Text } = Typography;
const { TextArea } = Input;
class BusinessTransfer extends Component {
    form = React.createRef();useDivRef=React.createRef()
    state = {
        errorMessage: null,
        isLoading: true,
        details: {},
        selectedTab: this.props.transferData?.transferType || "domestic", 
        isBtnLoading: false,
        showDeclaration: false,isEdit:false,
        isSelectedId: null,
        isShowValid: false,
        isValidCheck: false,
        iBanValid: false,
         ibanDetails: {},
        isValidateLoading: false,
        ibanDetailsLoading: false,
        isValidateMsg: false,
        payeeaccountDetails:null,
        gbpdetails:{}
    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true,details:this.props.transferData });
            let data = this.props.transferData;
            let edit=false;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
                data.payeeAccountModels[0].documents = {"transfer": "", "payee": ""}
            }
            if (this.props.selectedAddress?.id) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails, line1: data.line1, line2: data.line2, line3: data.line3, bankAddress1: accountDetails.line1, bankAddress2: accountDetails.line2,country:data.country,city:data.city,address:data.line1,postalCode:data.postalCode };
                delete data["documents"];
                 edit = true;
            }
            if(data.transferType=== "international"){
                this.setState({ ...this.state, selectedTab:data.transferType })
            }
            else if(data.transferType=== "internationalIBAN"){
                this.setState({ ...this.state, selectedTab:data.transferType })
                 this.handleIbanChange({ target: { value: data?.iban, isNext: true } });
            }
            else{
                this.setState({ ...this.state, selectedTab:"domestic" })  
            }
            const ibanDetails = this.props.transferData?.payeeAccountModels[0] || {}
            this.setState({ ...this.state, errorMessage: null, details: data,isEdit:edit, isSelectedId:  this.props.transferData.id, ibanDetails}, () => {
                this.setState({ ...this.state, isLoading: false })
            });
       

    }
    submitPayee = async (values) => {
        let { details, selectedTab,isEdit,isSelectedId, ibanDetails } = this.state;
        this.setState({ ...this.state, errorMessage: null});
        if (Object.hasOwn(values, 'iban')) {
        this.setState({ ...this.state, errorMessage: null});
        if ((!ibanDetails || Object.keys(ibanDetails).length === 0)) {
            this.setState({ ...this.state, errorMessage: "Please click validate button before saving", isLoading: false, isBtnLoading: false });
            this.useDivRef.current.scrollIntoView()
            return;
        }
        }
        let _obj = { ...details, ...values };
       _obj.payeeAccountModels[0].currencyType = "Fiat";
       _obj.payeeAccountModels[0].walletCode = this.props.currency;
        _obj.payeeAccountModels[0].accountNumber = values?.accountNumber;
        _obj.payeeAccountModels[0].bankName = selectedTab === "internationalIBAN" ? ibanDetails?.bankName :  values?.bankName;
        _obj.payeeAccountModels[0].abaRoutingCode = values?.abaRoutingCode;
        _obj.payeeAccountModels[0].swiftRouteBICNumber = values?.swiftRouteBICNumber;
        _obj.payeeAccountModels[0].line1 = selectedTab === "internationalIBAN" ? ibanDetails?.bankAddress : values.bankAddress1;
        _obj.payeeAccountModels[0].line2 = values.bankAddress2;

        _obj.addressType = "otherbusiness";
        _obj.transferType = selectedTab;
        _obj.amount = this.props.amount;
        _obj.beneficiaryName = values?.beneficiaryName;
        _obj.payeeAccountModels[0].city = ibanDetails?.city || values?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country || values.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode || values?.postcode;
        _obj.payeeAccountModels[0].ukSortCode = values?.ukSortCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban ? values?.iban : this.form.current?.getFieldValue('iban');
        if(isEdit){
            _obj.id = isSelectedId? isSelectedId:details?.payeeId;
        }
        if (_obj.payeeAccountModels[0].documents) {
            _obj.payeeAccountModels[0].documents.customerId = this.props?.userProfile?.id;
        }
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        this.setState({ ...this.state, errorMessage: null, isLoading: false, isBtnLoading: true });

        let temp = JSON.parse(JSON.stringify(_obj))
        temp.payeeAccountModels[0].documents = _obj.payeeAccountModels[0]?.documents?.transfer ||_obj.payeeAccountModels[0]?.documents?.payee
        
        const response = await savePayee(this.state.isEdit ? _obj : temp);   
        
        if (response.ok) {
            if (this.props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer, documents: _obj.payeeAccountModels[0]?.documents?.transfer })
                if (confirmRes.ok) {this.useDivRef.current.scrollIntoView()
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                } else {
                    this.setState({ ...this.state, errorMessage: apiCalls.isErrorDispaly(confirmRes), isLoading: false, isBtnLoading: false });
                }
            } else {
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false, showDeclaration: true });
                this.props?.updatedHeading(true)
            }
        } else {this.useDivRef.current.scrollIntoView()
            this.setState({ ...this.state, details: { ...details, ...values }, errorMessage: apiCalls.isErrorDispaly(response), isLoading: false, isBtnLoading: false });
        }
    }
    handleTabChange = (key) => {
        let _obj = { ...this.state.details}
        _obj.payeeAccountModels[0].documents={"transfer": "", "payee": ""}
        this.setState({ ...this.state, selectedTab: key,errorMessage:null, ibanDetails: {}, iBanValid: false, enteredIbanData: null });this.form.current.resetFields();
    }
   
    handleIbanChange = async ({ target: { value,isNext } }) => {
        if (value?.length >= 10 && isNext) {
            this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true,iBanValid:true,enteredIbanData: value, isShowValid: false, ibanDetails: {},isValidateLoading:true});
            const response = await fetchIBANDetails(value);
            if (response.ok) {
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    this.setState({ ...this.state, enteredIbanData: value, ibanDetails: response.data, ibanDetailsLoading: false, errorMessage: null, iBanValid:true, isValidateLoading: false});
                }else{
                    if(this.state.ibanDetails && !this.state.ibanDetails?.routingNumber|| !this.state.ibanDetails?.bankName) {
                        this.setState({ ...this.state, errorMessage: "No bank details are available for this IBAN number", enteredIbanData: value, ibanDetails:{}, ibanDetailsLoading: false,  iBanValid:false, isValidateLoading: false });
                        this.useDivRef.current?.scrollIntoView();
                        return;
                    }
                }
            } else {
                this.setState({ ...this.state, enteredIbanData: value, ibanDetailsLoading: false,iBanValid:false, errorMessage: apiCalls.isErrorDispaly(response), isValidateLoading: false });
            }
        }
        else{
            this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, enteredIbanData: value, isShowValid: false, isValidateLoading: false, ibanDetails: {} })
        }
    }
    onIbanValidate = (e) => {
        let value = e ? e: this.form.current?.getFieldValue('iban');
        if (value?.length >= 10) {
            if (value &&!/^[A-Za-z0-9]+$/.test(value)) {
                this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
                this.form.current?.validateFields(["iban"], this.validateIbanType)
            }
            else {
                this.setState({ ...this.state, isValidCheck: true, isShowValid: false, isValidateLoading: true});
                this.handleIbanChange({ target: { value: value, isNext: true }});
            }
        }
        else {
            this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
            this.form.current?.validateFields(["iban"], this.validateIbanType)
        }
    }
     validateNumber = (_, validNumberValue) => {
        if (validNumberValue === ".") {
            return Promise.reject("Please enter valid content");
        }
        return Promise.resolve();
    }
     validateIbanType = (_, value) => {
        this.setState({ ...this.state, isValidateLoading: false});
        if ((!value&&this.state.isShowValid)||!value) {
            return Promise.reject(apiCalls.convertLocalLang("is_required"));
        } else if ((!this.state.iBanValid&&this.state.isShowValid)|| value?.length < 10) {
            this.setState({ ...this.state, ibanDetails : {}});
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            this.setState({ ...this.state,ibanDetails:{}});
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    render() {
        const { isLoading, details, selectedTab, errorMessage } = this.state;
        if (isLoading) {
            return <Loader />
        }
        if (this.state.showDeclaration) {
            return <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image  preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
               Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved. `}</Text>
            </div>
            </div>
        }
        return <div ref={this.useDivRef}><Tabs className="cust-tabs-fait" onChange={this.handleTabChange} activeKey={selectedTab}>
            <Tabs.TabPane tab={this.props.currency=="USD" ?`Domestic ${this.props.currency} transfer` : ` ${this.props.currency} LOCAL TRANSFER`} className="text-white" key={"domestic"} disabled={this.state.isEdit}>
                <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
               {this.props.currency ==="GBP" && <h2  className="adbook-head">Bank Details</h2>}
               {console.log(this.state.gbpdetails,'gbpdetails')}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form} 
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}
                                    className="cust-input"
                                    placeholder={" Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                      {this.props.currency==="GBP" &&  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                label={"BussinessName"}
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
                                    maxLength={100}
                                    className="cust-input"
                                    placeholder={"BussinessName"}
                                />
                            </Form.Item>
                        </Col>}
                       {this.props.currency==="GBP" && <> 
                  
                 <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item
							name="ukSortCode"
							label="UkSortCode"
							className="custom-label"
							type="number"
							rules={[
								{
									required: true,
									message: "Is required",
								},
								{
									validator: this.validateNumber
                                }
							]}>
							<NumberFormat
								className="cust-input value-field cust-addon mt-0"
								customInput={Input}
								prefix={""}
								placeholder="Enter UkSortCode"
								allowNegative={false}
								maxlength={6}
							/>
						</Form.Item>
					</Col>
                    <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
						<Form.Item
							name="accountNumber"
							label="Account Number"
							className="custom-label"
							type="number"
							rules={[
								{
									required: true,
									message: "Is required",
								},
								{
									validator:this.validateNumber
                                }
							]}>
							<NumberFormat
								className="cust-input value-field cust-addon mt-0"
								customInput={Input}
								prefix={""}
								placeholder="Enter AccountNumber"
								allowNegative={false}
								maxlength={8}
							/>
						</Form.Item>
					</Col>
                </>}
                        <PayeeBankDetails currency={this.props.currency}  />
                    </Row>
                  { this.props.currency !="GBP" && <h2 className="adbook-head">Recipient's Details</h2>}
                    <Row>
                       {this.props.currency ==="USD" &&<> <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>

                            </Form.Item>
                        </Col></>}
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                      {this.props.currency !="GBP" && <RecipientAddress />}
                    </Row>

                   {this.props.currency !="GBP" && <Paragraph className="adbook-head" >Bank Details</Paragraph>}
                   {this.props.currency !="GBP" && <DomesticTransfer type={this.props.type} />}
                    {this.props.type !== "manual" && this.props.currency !="GBP" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                    <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                        let { payeeAccountModels } = this.state.details;
                        payeeAccountModels[0].documents.transfer = docs;
                        this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                    }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="">

                                <Button
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="pop-btn "
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>

                    </div>
                </Form></div>
            </Tabs.TabPane>
          { this.props.currency !="GBP" && <Tabs.TabPane tab="International USD Swift" key={"international"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
           
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >
                    <Row >
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}
                                    className="cust-input"
                                    placeholder={" Save Whitelist Name As"}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <h2 className="adbook-head">Recipient's Details</h2>
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>
                    <h2  className="adbook-head">Bank Details</h2>
                    <InternationalTransfer type={this.props.type} />
                    {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                payeeAccountModels[0].documents.transfer = docs;
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="text-right mt-12">
                                <Button
                                    htmlType="submit"
                                    size="large"
                                    block
                                    className="pop-btn"
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                    </div>
                </Form></div>

            </Tabs.TabPane>}

            <Tabs.TabPane tab={this.props.currency == "USD" ? `International ${this.props.currency} IBAN` : ` ${this.props.currency} INTERNATIONAL TRANSFER`} key={"internationalIBAN"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
            {this.props.currency ==="GBP" && <h2  className="adbook-head">Bank Details</h2>}
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form}
                    onFinish={this.submitPayee}
                    scrollToFirstError
                >                    
                    <Row >
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}
                                    className="cust-input"
                                    placeholder={" Save Whitelist Name As"}
                                />
                            </Form.Item>
                        </Col>
                      {this.props.currency ==="GBP" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                label={"BussinessName"}
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
                                    maxLength={100}
                                    className="cust-input"
                                    placeholder={"BussinessName"}
                                />
                            </Form.Item>
                        </Col>}
                    </Row>
                    {this.props.currency !="GBP" && <><Paragraph className="adbook-head"  >Recipient's Details</Paragraph>
                    <Row>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
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
                                    maxLength={100}/>

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to prove your relationship with the beneficiary. E.g. Contracts, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                if(this.state.isEdit){
                                    payeeAccountModels[0].documents = docs;
                                } else{
                                    payeeAccountModels[0].documents.payee = docs;
                                }
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </ Col>
                        <RecipientAddress />
                    </Row></>}

                    {this.props.currency !="GBP" &&<Paragraph className="adbook-head" >Bank Details</Paragraph>}
                    <Row className="validateiban-content">
                   <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                       <div className=" custom-btn-error">
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="iban"
                                label={"IBAN"}
                                required
                                rules={[
                                    {
                                        validator: this.validateIbanType,
                                      },
                                ]}
                            >
                                <Input
                                    className="cust-input ibanborder-field"
                                    placeholder={"IBAN"}
                                    onChange={this.handleIbanChange}
                                    maxLength={50}
                                    addonAfter={ <Button className={``}
                                    type="primary"
                                       loading={this.state.isValidateLoading}
                                       onClick={() => this.onIbanValidate(this.state?.enteredIbanData)} >
                                   <Translate content="validate" />
                           </Button>  }
                                    />

                            </Form.Item>
                            </div>
                       </Col>                     
                    </Row>
                    <div className="box basic-info alert-info-custom mt-16 kpi-List">
                        <Spin spinning={this.state.ibanDetailsLoading}>
                        {this.state.iBanValid && <Row>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label">
                                    Bank Name
                                </label>
                                <div className=""><Text className="kpi-val">{this.state.ibanDetails?.bankName || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                BIC
                                </label>
                                <div className=""><Text className="kpi-val">{this.state.ibanDetails?.routingNumber || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Branch
                                </label>
                                <div className=""><Text className="kpi-val">{this.state?.ibanDetails?.branch || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Country
                                </label>
                                <div><Text className="kpi-val">{this.state?.ibanDetails?.country || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    State
                                </label>
                                <div><Text className="kpi-val">{this.state?.ibanDetails?.state || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    City
                                </label>
                                <div><Text className="kpi-val">{this.state?.ibanDetails?.city || "-"}</Text></div>
                            </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                                <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Zip
                                </label>
                                <div><Text className="kpi-val">{this.state?.ibanDetails?.zipCode || "-"}</Text></div>
                            </div>
                            </Col>
                        </Row>}
                        {!this.state.iBanValid && !this.state.ibanDetailsLoading &&
                                <div><Text className="info-details">No bank details available</Text></div>

                           }
                        </Spin>
                       
                    </div>
                    <PayeeBankDetails currency={this.props.currency} createPayeeObj={this.props.transferData}/>
                        {this.props?.type !== "manual" && this.props.currency !="GBP"&& <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="reasonOfTransfer"
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
                                    "Reason For Transfer"
                                }
                            >
                                <TextArea
                                    placeholder={"Reason For Transfer"}
                                    className="cust-input cust-text-area address-book-cust"
                                    autoSize={{ minRows: 1, maxRows: 1 }}
                                    maxLength={200}
                                ></TextArea>
                            </Form.Item>
                        </Col>}
                        {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                payeeAccountModels[0].documents.transfer = docs;
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                     {this.props.type === "manual" && this.props.currency !="USD" &&
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet documents={this.state?.details?.payeeAccountModels[0]?.documents || null} editDocument={this.state.isEdit} onDocumentsChange={(docs) => {
                                let { payeeAccountModels } = this.state.details;
                                payeeAccountModels[0].documents.transfer = docs;
                                this.setState({ ...this.state, details: { ...this.state.details, payeeAccountModels } })
                            }} refreshData ={selectedTab}/>
                        </React.Fragment>)
                    }
                    <div className="text-right mt-36">  
                                <Button
                                   htmlType="submit"
                                   size="large"
                                   block
                                   className="pop-btn"
                                    loading={this.state.isBtnLoading}>
                                    {this.props.type === "manual" && "Save"}
                                    {this.props.type !== "manual" && "Continue"}
                                </Button>
                    </div>
                </Form></div>

            </Tabs.TabPane>
        </Tabs></div>
    }
}

export default ConnectStateProps(BusinessTransfer);