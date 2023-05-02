import { Form, Row, Col, Typography, Input, Button, Image, Spin, Alert, Tabs,Select } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import Loader from "../../../Shared/loader";
import { validateContentRule } from "../../../utils/custom.validator";
import ConnectStateProps from "../../../utils/state.connect";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, payeeAccountObj, savePayee, fetchIBANDetails,getRelationDetails,getReasonforTransferDetails } from "../api";
import DomesticTransfer from "./domestic.transfer";
import InternationalTransfer from "./international.transfer";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
import apicalls from "../../../api/apiCalls";
import { connect } from "react-redux";
const { Paragraph, Title, Text } = Typography;
const { TextArea } = Input;
const {Option}=Select;
class BusinessTransfer extends Component {
    form = React.createRef();useDivRef=React.createRef()
    form1 = React.createRef()
    form2 = React.createRef()
    state = {
        errorMessage: null,
        isLoading: true,
        details: {},
        selectedTab: this.props.transferData?.transferType ||this.props.currency=='SGD' && "SWIFT/BIC" || "domestic", 
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
        gbpdetails:{},
        documents:null,
        reasonDocuments:null,
        relationData:[],
        selectedRelation:null,
        reasonForTransferDataa:[],
        selectedReasonforTransfer:null,
    };
    componentDidMount() {
        this.loadDetails();
        this.getRelationData();
        this.getReasonForTransferData();
    }
    loadDetails = async () => {
        let data = this.props.transferData;
        this.setState({ ...this.state, errorMessage: null, isLoading: true,details:this.props.transferData,documents:this.props.transferData?.payeeAccountModels[0]?.docrepoitory,selectedRelation:data.relation });
            let edit=false;
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
            }
            if (this.props.selectedAddress?.id) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails, line1: data.line1, line2: data.line2, line3: data.line3, bankAddress1: accountDetails.line1, bankAddress2: accountDetails.line2,ukSortCode:accountDetails.ukSortCode};
                delete data["documents"];
                 edit = true;
            }
            if(data.transferType=== "international"){
                this.setState({ ...this.state, selectedTab:data.transferType })
            }
            else if(data.transferType=== "internationalIBAN"){
                this.setState({ ...this.state, selectedTab:data.transferType })
                 this.handleIbanChange({ target: { value: data?.iban, isNext: true } });
            }else if(data.transferType=== "SWIFT/BIC"||this.props.currency=="SGD"){
                this.setState({ ...this.state, selectedTab:"SWIFT/BIC" })
            }
            else{
                this.setState({ ...this.state, selectedTab:"domestic" })  
            }
            const ibanDetails = this.props.transferData?.payeeAccountModels[0] || {}
            this.setState({ ...this.state, errorMessage: null, details: data,isEdit:edit, isSelectedId:  this.props.transferData.id, ibanDetails,selectedRelation:data.relation}, () => {
                this.setState({ ...this.state, isLoading: false,selectedRelation:data.relation})
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
        _obj.transferType = this.props.currency=='CHF'&&'chftransfer'||this.props.currency=='SGD'&&'SWIFT/BIC' ||selectedTab;
        _obj.amount = this.props.amount || 0;
        _obj.payeeAccountModels[0].ukSortCode = values?.ukSortCode;
        _obj.payeeAccountModels[0].city = ibanDetails?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban ? values?.iban : this.form2.current?.getFieldValue('iban');
        _obj.payeeAccountModels[0].docrepoitory =  this.state?.documents;
        _obj.createdBy = this.props.userProfile?.userName;
        _obj.info =JSON.stringify(this.props?.trackAuditLogData);
        if(isEdit){
            _obj.id = isSelectedId? isSelectedId:details?.payeeId;
        }

                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        this.setState({ ...this.state, errorMessage: null, isLoading: false, isBtnLoading: true });
        let temp = JSON.parse(JSON.stringify(_obj))
       temp.payeeAccountModels[0].docrepoitory =  this.state?.documents
        const response = await savePayee(this.state.isEdit ? _obj : temp);   
        
        if (response.ok) {
            if (this.props.type !== "manual") {
                    this.useDivRef.current.scrollIntoView()
                    this.props.onContinue(response.data);
            } else {
                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false, showDeclaration: true });
                this.props?.updatedHeading(true)
            }
        } else {this.useDivRef.current.scrollIntoView()
            this.setState({ ...this.state, details: { ...details, ...values }, errorMessage: apiCalls.isErrorDispaly(response), isLoading: false, isBtnLoading: false });
        }
    }
    handleTabChange = (key) => {
        if(key=='domestic'){
            this.form.current?.resetFields();
       }else if(key=='international'){
           this.form1.current?.resetFields();
       }else {
           this.form2.current?.resetFields();
       }
        let _obj = { ...this.state.details}
        this.setState({ ...this.state, selectedTab: key,errorMessage:null, ibanDetails: {}, iBanValid: false, enteredIbanData: null,documents:null,reasonDocuments:null ,selectedRelation:null,selectedReasonforTransfer:null});this.form.current.resetFields();
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
        let value = e ? e: this.form2.current?.getFieldValue('iban');
        if (value?.length >= 10) {
            if (value &&!/^[A-Za-z0-9]+$/.test(value)) {
                this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
                this.form2.current?.validateFields(["iban"], this.validateIbanType)
            }
            else {
                this.setState({ ...this.state, isValidCheck: true, isShowValid: false, isValidateLoading: true});
                this.handleIbanChange({ target: { value: value, isNext: true }});
            }
        }
        else {
            this.setState({ ...this.state, isValidCheck: false, isShowValid: true, iBanValid: false, ibanDetails: {}, isValidateLoading: true, isValidateMsg: true, errorMessage: null});
            this.form2.current?.validateFields(["iban"], this.validateIbanType)
        }
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
    getRelationData=async()=>{
        let res = await getRelationDetails()
        if(res.ok){
            this.setState({...this.state,relationData:res.data,errorMessage:null})
        }else{
            this.setState({...this.state,errorMessage: apiCalls.isErrorDispaly(res),})
           
        }
    }
    handleRelation=(e)=>{
        this.setState({...this.state,selectedRelation:e})
        if(!this.state.isEdit){
            if(this.state.selectedTab=='domestic' || this.props.currency=="SGD"){
                this.form.current?.setFieldsValue({others:null})
           }else if(this.state.selectedTab=='international'){
            this.form1.current?.setFieldsValue({others:null})
           }else {
            this.form2.current?.setFieldsValue({others:null})
           }
        }else if(this.state.isEdit && this.state.details.relation !='Others') {
            if(this.state.selectedTab=='domestic'){
                this.form.current?.setFieldsValue({others:null})
           }else if(this.state.selectedTab=='international'){
            this.form1.current?.setFieldsValue({others:null})
           }else {
            this.form2.current?.setFieldsValue({others:null})
           }
        }     
    }
    getReasonForTransferData=async()=>{
        let res = await getReasonforTransferDetails();
        if(res.ok){
            this.setState({...this.state,reasonForTransferDataa:res.data,errorMessage:null})
        }else{
            this.setState({...this.state,errorMessage: apiCalls.isErrorDispaly(res),})
           
        }
    }

    handleReasonTrnsfer=(e)=>{
        this.setState({...this.state,selectedReasonforTransfer:e})
        if(this.state.selectedTab=='domestic'){
            this.form.current.setFieldsValue({transferOthers:null})
       }else if(this.state.selectedTab=='international'){
        this.form1.current.setFieldsValue({transferOthers:null})
       }else {
        this.form2.current.setFieldsValue({transferOthers:null})
       }
    }
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

            <Tabs.TabPane tab={this.props.currency=="USD" && `Domestic ${this.props.currency} transfer` || this.props.currency=="GBP" && `Local  ${this.props.currency} Transfer` ||  this.props.currency=="CHF" && `Swift  ${this.props.currency} Transfer`  || this.props.currency =='SGD' && `${this.props.currency} SWIFT/BIC`} className="text-white" key={this.props.currency=="SGD" && "SWIFT/BIC"||"domestic"} disabled={this.state.isEdit}>
                <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
              
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
                                <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={"Relationship To Beneficiary"}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleRelation(e)}
                                >
                                    {this.state.relationData?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col>
                        {this.state.selectedRelation=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {
                            this.setState({...this.state,documents:docs})
                            }} refreshData ={selectedTab} type={"payee"}/>
                        </ Col>
                     <RecipientAddress />
                    </Row>

                    <Paragraph className="adbook-head" >Bank Details</Paragraph>
                    <DomesticTransfer type={this.props.type} currency={this.props.currency} form={this.form}  refreshData ={selectedTab}/>
                
                        {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {                              
                            this.setState({...this.state,reasonDocuments:docs})
                            }} refreshData ={selectedTab}  type={"reasonPayee"}/>
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
            { (this.props.currency !="GBP" && this.props.currency !="CHF" && this.props.currency !="SGD")&&   <Tabs.TabPane tab="International USD Swift" key={"international"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
           
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form1}
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
                                 <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={"Relationship To Beneficiary"}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleRelation(e)}
                                >
                                    {this.state.relationData?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                       
                        {this.state.selectedRelation=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {                             
                            this.setState({...this.state,documents:docs})
                            }} refreshData ={selectedTab} type={"payee"}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>
                    <h2  className="adbook-head">Bank Details</h2>
                    <InternationalTransfer type={this.props.type} form={this.form1} editDocument={this.state.isEdit}  refreshData ={selectedTab}/>
                    {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {                              
                            this.setState({...this.state,reasonDocuments:docs})
                            }} refreshData ={selectedTab}    type={"reasonPayee"}/>
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

            <Tabs.TabPane tab={this.props.currency == "USD" && `International ${this.props.currency} IBAN` || this.props.currency == "GBP" && `International ${this.props.currency}  Transfer` || this.props.currency == "CHF" && `IBAN ${this.props.currency}  Transfer`} key={"internationalIBAN"} disabled={this.state.isEdit}>
            <div>{errorMessage && <Alert type="error" description={errorMessage} showIcon />}
         
                <Form initialValues={details}
                    className="custom-label  mb-0"
                    ref={this.form2}
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
                    <Paragraph className="adbook-head"  >Recipient's Details</Paragraph>
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
                                <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={"Relationship To Beneficiary"}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleRelation(e)}
                                >
                                    {this.state.relationData?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col>
                        {this.state.selectedRelation=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {                              
                            this.setState({...this.state,documents:docs})
                            }} refreshData ={selectedTab} type={"payee"}/>
                        </ Col>
                        <RecipientAddress />
                    </Row>

                    <Paragraph className="adbook-head" >Bank Details</Paragraph>
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
                        {this.props?.type !== "manual" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                                 <Select
                                    className="cust-input"
                                    maxLength={100}
                                    placeholder={apicalls.convertLocalLang(
                                        "reasiontotransfor"
                                    )}
                                    optionFilterProp="children"
                                    onChange={(e)=>this.handleReasonTrnsfer(e)}
                                >
                                    {this.state.reasonForTransferDataa?.map((item, idx) => (
                                    <Option key={idx} value={item.name}>
                                        {item.name}
                                    </Option>
                                    ))}
                                </Select> 
                            </Form.Item>
                        </Col>}
                        {this.state.selectedReasonforTransfer=="Others" && <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                            className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                            name="transferOthers"
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
                        {this.props.type !== "manual" && 
                        (<React.Fragment>
                            <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {                             
                            this.setState({...this.state,reasonDocuments:docs})
                            }} refreshData ={selectedTab}  type={"reasonPayee"}/>
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
const connectStateToProps = ({userConfig,
}) => {
  return {
    userConfig: userConfig.userProfileInfo,
    trackAuditLogData: userConfig.trackAuditLogData,
  };
};
export default connect(connectStateToProps)(BusinessTransfer);