import { Form, Row, Col,Typography, Input, Button, Alert, Image, Spin } from "antd";
import React, { Component } from "react";
import apiCalls from "../../../api/apiCalls";
import { validateContentRule } from "../../../utils/custom.validator";
import AddressDocumnet from "../../addressbook.component/document.upload";
import { RecipientAddress } from "../../addressbook.v2/recipient.details";
import { confirmTransaction, createPayee, fetchIBANDetails, payeeAccountObj, savePayee } from "../api";
import BusinessTransfer from "./transfer";
import ConnectStateProps from "../../../utils/state.connect";
import Loader from "../../../Shared/loader";
import Translate from "react-translate-component";
import alertIcon from '../../../assets/images/pending.png';
import apicalls from "../../../api/apiCalls";
const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

class OthersBusiness extends Component {
    form = React.createRef();
    useDivRef=React.createRef()
    state = {
        errorMessage: null,
        ibanDetailsLoading: false,
        isLoading: true,
        details: {},
        ibanDetails: {},
        docDetails: {}, isBtnLoading: false,
        showDeclartion: false,
        iBanValid:false,
        isEdit: false,
        isSelectedId: null,
        enteredIbanData: null,
        isShowValid: false,
        isValidateLoading: false,
        isValidCheck: false,
        isValidateMsg: false,
        objData:{},
        editData:{},
        documents:null,
        rasonDocuments:null

    };
    componentDidMount() {
        this.loadDetails();
    }
    loadDetails = async () => {
        this.setState({ ...this.state, errorMessage: null, isLoading: true });
        const response = await createPayee( this.props.selectedAddress?.id || "", "otherbusiness");
        if (response.ok) {
            let edit=false;
            let data = response.data;
            this.setState({ ...this.state, objData: data, editData:response.data,
            documents:response.data?.payeeAccountModels !=null ? response.data?.payeeAccountModels[0]?.docrepoitory :response.data?.payeeAccountModels});
            if (!data?.payeeAccountModels) {
                data.payeeAccountModels = [payeeAccountObj()];
                data.payeeAccountModels[0].docrepoitory = []
            }
            if (this.props.selectedAddress?.id) {
                const accountDetails = data.payeeAccountModels[0];
                data = { ...data, ...accountDetails,line1:data.line1,line2:data.line2,line3:data.line3,bankAddress1:accountDetails.line1,bankAddress2:accountDetails.line2 ,country:response.data?.country,city:response.data.city,address:response.data.line1,postalCode:response.data.postalCode};
                delete data["documents"];
                if (data?.iban) {
                    this.handleIbanChange({ target: { value: data?.iban, isNext: true } });
                } 
                 edit = true;
            }
            this.props?.onEdit(edit);
            const ibanDetails = response.data?.payeeAccountModels[0] || {}
            this.setState({ ...this.state, errorMessage: null, details: data, ibanDetails }, () => {
                this.setState({ ...this.state, isLoading: false, isEdit: edit, isSelectedId:  response.data?.id });
            });
        } else {
            this.setState({ ...this.state, errorMessage: response.data?.message || response.data || response.originalError?.message, isLoading: false, details: {} });
        }
    }
    handleIbanChange = async ({ target: { value,isNext } }) => {
        if (value?.length >= 10 && isNext) {
            this.setState({ ...this.state, errorMessage: null, ibanDetailsLoading: true,iBanValid:true ,ibanDetails: {}, enteredIbanData: value, isShowValid: false,errorMessage: null,isValidateLoading:true});
            const response = await fetchIBANDetails(value);
            if (response.ok) {
                if(response.data && (response.data?.routingNumber || response.data?.bankName)){
                    this.setState({ ...this.state, ibanDetails: response.data, enteredIbanData: value, ibanDetailsLoading: false, errorMessage: null, iBanValid:true, isValidateLoading: false,isValidateLoading:false });
                }else{
                    if(this.state.ibanDetails && !this.state.ibanDetails?.routingNumber|| !this.state.ibanDetails?.bankName) {
                        this.setState({ ...this.state, ibanDetails: {}, ibanDetailsLoading: false, errorMessage: null, iBanValid:false, isValidateLoading: false });
                        this.setState({ ...this.state, errorMessage: "No bank details are available for this IBAN number", isLoading: false, isBtnLoading: false });
                        this.useDivRef.current?.scrollIntoView();
                        return;
                    }
                }
            } else {
                this.setState({ ...this.state, enteredIbanData: value, ibanDetailsLoading: false,iBanValid:false, errorMessage: response.data || response.data?.message || response.originalError?.message, isValidateLoading: false, ibanDetails: {}});
            }
        }
        else{
            this.setState({ ...this.state, ibanDetailsLoading: false,iBanValid:false, enteredIbanData: value, isShowValid: false, isValidateLoading: false,ibanDetails: {},errorMessage: null})
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

     validateIbanType = (_, value) => {
        this.setState({ ...this.state, isValidateLoading: false});
        if ((!value&&this.state.isShowValid)||!value) {
            this.setState({ ...this.state, iBanValid : false, ibanDetails: {}});
            return Promise.reject(apiCalls.convertLocalLang("is_required"));
        } else if ((!this.state.iBanValid&&this.state.isShowValid) || value?.length < 10) {
            this.setState({ ...this.state, ibanDetails: {}});
            return Promise.reject("Please input a valid IBAN");
        } else if (
            value &&this.state.isShowValid&&
            !/^[A-Za-z0-9]+$/.test(value)
        ) {
            this.setState({ ...this.state, iBanValid : false, ibanDetails: {}});
            return Promise.reject(
                "Please input a valid IBAN"
            );
        }
        else {
            return Promise.resolve();
        }
    };
    submitPayee = async (values) => {
        let { details, ibanDetails,isSelectedId,isEdit } = this.state;
        if (Object.hasOwn(values, 'iban')) {
            this.setState({ ...this.state, errorMessage: null });
            if ((!ibanDetails || Object.keys(ibanDetails).length === 0)) {
                this.setState({ ...this.state, errorMessage: "Please click validate button before saving", isLoading: false, isBtnLoading: false });
                this.useDivRef.current?.scrollIntoView();
                return;
            }
        }
        let _obj = { ...details, ...values };
        _obj.payeeAccountModels[0].line1 = ibanDetails.bankAddress;
        _obj.payeeAccountModels[0].city = ibanDetails?.city;
        _obj.payeeAccountModels[0].state = ibanDetails?.state;
        _obj.payeeAccountModels[0].country = ibanDetails?.country;
        _obj.payeeAccountModels[0].postalCode = ibanDetails?.zipCode;
        _obj.payeeAccountModels[0].bankBranch = ibanDetails?.branch;
        _obj.payeeAccountModels[0].bic=ibanDetails?.routingNumber;
        _obj.payeeAccountModels[0].iban = values?.iban ? values?.iban : this.form.current?.getFieldValue('iban');
        _obj.payeeAccountModels[0].currencyType = "Fiat";
        _obj.payeeAccountModels[0].walletCode = this.props.currency;
        _obj.payeeAccountModels[0].bankName = ibanDetails?.bankName;
        _obj.payeeAccountModels[0].docrepoitory =  this.state?.documents
        _obj.createdBy = this.props.userProfile?.userName;
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        
        _obj.addressType = "otherbusiness";
        _obj.transferType = this.props.currency=='CHF'?'chftransfer':"sepa";
        _obj.amount = this.props.amount;
        if(isEdit){
            _obj.id = isSelectedId? isSelectedId:details?.payeeId;
        }

                this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: true });
        delete _obj.payeeAccountModels[0]["adminId"] // deleting admin id
        this.setState({ ...this.state, errorMessage: null, isLoading: false, isBtnLoading: true });
        let temp = JSON.parse(JSON.stringify(_obj))
       temp.payeeAccountModels[0].docrepoitory =  this.state?.documents      
       const response = await savePayee(_obj);   

       if (response.ok) {
            if (this.props.type !== "manual") {
                const confirmRes = await confirmTransaction({ payeeId: response.data.id, amount: this.props.amount, reasonOfTransfer: _obj.reasonOfTransfer, 
                    docRepositories:this.state.rasonDocuments 
                 })
                if (confirmRes.ok) {
                    this.props.onContinue(confirmRes.data);
                    this.setState({ ...this.state, isLoading: false, errorMessage: null, isBtnLoading: false });
                } else {
                    this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: apiCalls.isErrorDispaly(confirmRes), isLoading: false, isBtnLoading: false });
                  window.scrollTo(0, 0);
                }
            } else {
                this.setState({ ...this.state, errorMessage: null, isBtnLoading: false, showDeclartion: true });
                this.useDivRef.current?.scrollIntoView(0,0)
                this.props.headingUpdate(true);
                this.props.isHideTabs(false);
            }

        } else {
            this.setState({ ...this.state, details: { ...this.state.details, ...values }, errorMessage: apiCalls.isErrorDispaly(response), isLoading: false, isBtnLoading: false });
        }

    }
    render() {
        const { isUSDTransfer } = this.props;
        if (this.state.isLoading) {
            return <Loader />
        }
        if (this.state.showDeclartion) {
            return  <div className="custom-declaraton align-declaration"> <div className="success-pop text-center declaration-content">
                <Image  preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved. `}</Text>
                <div className="my-25">
                    </div>
            </div></div>
        }
        if (isUSDTransfer) { return <BusinessTransfer type={this.props.type} transferData={this.state.objData} updatedHeading={this.props?.headingUpdate} amount={this.props?.amount} onContinue={(obj) => this.props.onContinue(obj)} selectedAddress={this.props.selectedAddress} currency={this.props.currency} types={this.props.ontheGoType}/> }
        else {
            return <><div ref={this.useDivRef}>
                {this.props.currency !="CHF" && <h2 className="adbook-head">SEPA Transfer</h2>}
                {this.props.currency =="CHF" && <h2 className="adbook-head">CHF Transfer</h2>}
                {this.props.currency !="EUR" &&this.props.currency !="CHF" &&  <h2  className="adbook-head">Bank Details</h2>}
                {this.state.isLoading && <Loader />}
                {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}
                {!this.state.isLoading && <Form
                  initialValues={this.state.details}
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
                                    placeholder={"Save Whitelist Name As"}
                                />


                            </Form.Item>
                        </Col>
                        {this.props.currency !="EUR" &&this.props.currency !="CHF" &&
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label"
                                name="beneficiaryName"
                                label={"Bussiness Name"}
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
                                    placeholder={"Bussiness Name"}
                                />


                            </Form.Item>
                        </Col>}
                    </Row>
                  {( this.props.currency == "CHF" ||this.props.currency == "EUR") && <> <Translate style={{ fontSize: 18 }}
                        content="Beneficiary_Details"
                        component={Paragraph}
                        className="mb-8 text-white fw-500 mt-16"
                    />
                    <Row >
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
                            <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {
                            this.setState({...this.state,documents:docs})
                            }} 
                            type={"payee"}
                            />
                        </ Col>                        
                        <RecipientAddress />


                    </Row>
                    <h2  className="adbook-head">Bank Details</h2></>}
                  
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
                                    addonAfter={<Button className={``}
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
                                <div ><Text className="kpi-val">{this.state.ibanDetails?.bankName || "-"}</Text></div>
                            </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                BIC
                                </label>
                                <div ><Text className="kpi-val">{this.state.ibanDetails?.routingNumber || "-"}</Text></div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mb-16">
                            <div className="kpi-divstyle">
                                <label className="kpi-label ">
                                    Branch
                                </label>
                                <div ><Text className="kpi-val">{this.state?.ibanDetails?.branch || "-"}</Text></div>
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
                  { this.props.currency !="EUR" &&this.props.currency !="CHF" &&  <> 
                  <Paragraph className="adbook-head" >Recipient Address</Paragraph>
                
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="country"
                        label={"country"}
                        rules={[
                            {
                                required: true,
                                message: "is required",
                            }, {
                                validator: validateContentRule,
                            },
                        ]}
                       
                    >
                        <Input
                            className="cust-input"
                            placeholder="currency"
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="city"
                        label="City"
                        rules={[
                            {
                                required: true,
                                message: "is required",
                                whitespace:true,
                            }, {
                                validator: validateContentRule,
                            },
                        ]}
                       
                    >
                        <Input
                            className="cust-input"
                            placeholder="City"
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="address"
                        label="Address"
                        rules={[
                            {
                                required: true,
                                message: "is required",
                                whitespace:true,
                            }, {
                                validator: validateContentRule,
                            },
                        ]}
                    >
                        <Input
                            className="cust-input"
                            placeholder="Address"
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Form.Item
                        className="custom-forminput custom-label"
                        name="postalCode"
                        label="Post Code"
                        rules={[
                            {
                                required: true,
                                message: "is required",
                                whitespace:true,
                            }, {
                                validator: validateContentRule,
                            },
                        ]}
                    >
                        <Input
                            className="cust-input"
                            placeholder="Post Code"
                            maxLength={50}
                        />
                    </Form.Item>
                </Col></>}
                { this.props.ontheGoType === "Onthego" &&this.props.currency != "CHF"&& this.props.currency != "EUR"&& <Paragraph className="adbook-head" >Compliance</Paragraph>}
                { this.props.ontheGoType === "Onthego" &&  <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
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
                                    <Translate
                                        content="reasiontotransfor"
                                        component={Form.label}
                                    />
                                }
                            >
                            <TextArea
                                placeholder={apicalls.convertLocalLang(
                                    "reasiontotransfor"
                                )}
                                className="cust-input cust-text-area address-book-cust"
                                autoSize={{ minRows: 1, maxRows: 2 }}
                                maxLength={100}
                            ></TextArea>
                            </Form.Item>
                        </Col>}
                        {this.props.type !== "manual" && 
                        (<React.Fragment>
                        <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                        <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {
                            this.setState({...this.state,rasonDocuments:docs})
                            }} 
                            type={"reasonPayee"}
                            />
                        </React.Fragment>)
                        }
                        {this.props.type === "manual" && this.props.currency != "EUR" &&this.props.currency != "CHF" &&
                        (<React.Fragment>
                        <Paragraph className="sub-abovesearch code-lbl upload-btn-mt">Please upload supporting documents to justify your transfer request. E.g. Invoice, Agreements</Paragraph>
                        <AddressDocumnet 
                            documents={this.state?.documents || this.props.transferData?.payeeAccountModels[0]?.docrepoitory} editDocument={this.state.isEdit} 
                            onDocumentsChange={(docs) => {
                            this.setState({...this.state,rasonDocuments:docs})
                            }}   type={"reasonPayee"}
                            />
                        </React.Fragment>)
                        }
                    <div className="">
                        <Button
                            htmlType="submit"
                            size="large"
                            block
                            className="pop-btn"
                            disabled={this.state.ibanDetailsLoading}
                            loading={this.state.isBtnLoading} >
                            {this.props.type === "manual" && "Save"}
                            {this.props.type !== "manual" && "Continue"}

                        </Button>
                    </div>
                </Form>}</div>
            </>;
        }

    }
}
export default ConnectStateProps(OthersBusiness);