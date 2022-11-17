import React, { Component } from "react";
import {Select,Input, Row, Col, Form, Button, Typography, List, Divider, Image, Alert, Spin, Empty } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png';
import NumberFormat from "react-number-format";
import { fetchPayees,getCoinwithBank, fetchPastPayees, confirmTransaction, saveWithdraw, validateAmount } from "./api";
import Loader from "../../Shared/loader";
import Search from "antd/lib/input/Search";
import Verifications from "./verification.component/verifications"
import { getVerificationFields } from "./verification.component/api"
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { fetchMemberWallets } from "../dashboard.component/api";
import Translate from "react-translate-component";
import { Link } from "react-router-dom";
import Paragraph from "antd/lib/typography/Paragraph";
import { connect } from "react-redux";
import { getFeaturePermissionsByKeyName } from "../shared/permissions/permissionService";
const { Text, Title } = Typography;
const { Option } = Select;
class OnthegoFundTransfer extends Component {
    enteramtForm = React.createRef();
    reasonForm = React.createRef();
    reviewScrool = React.createRef();
    state = {
        step: this.props.selectedCurrency ? "enteramount" : "selectcurrency",
        filterObj: [],
        selectedCurrency: this.props.selectedCurrency,
        addressOptions: { addressType: "myself", transferType: this.props.selectedCurrency === "EUR" ? "sepa" : "domestic" },
        isNewTransfer: false,
        amount: "",
        onTheGoObj: { amount: '', description: '' },
        reviewDetails: {},
        payees: [],
        payeesLoading: true,
        pastPayees: [],
        searchVal: "",
        errorMessage: null,
        codeDetails: { abaRoutingCode: "", swiftRouteBICNumber: "", reasionOfTransfer: "", documents: null },
        selectedPayee: {},
        selectedTab: "domestic",
        verifyData: null, isBtnLoading: false, reviewDetailsLoading: false,
        isVerificationEnable: true,
        isVarificationLoader: true,
        fiatWallets: [],
        isShowGreyButton: false,
        permissions: {},
        filtercoinsList: [],
        searchFiatVal:""
    }
    componentDidMount() {
        this.verificationCheck()
        getFeaturePermissionsByKeyName(`send_fiat`);
        this.permissionsInterval = setInterval(this.loadPermissions, 200);
        if (!this.state.selectedCurrency) {
            this.setState({ ...this.state, fiatWalletsLoading: true });
            fetchMemberWallets(this.props?.userProfile?.id).then(res => {
                if (res.ok) {
                    this.setState({ ...this.state, fiatWallets: res.data, filtercoinsList: res.data, fiatWalletsLoading: false });
                } else {
                    this.setState({ ...this.state, fiatWallets: [], filtercoinsList: [], fiatWalletsLoading: false });
                }
            });
        }
     if(this.state.selectedCurrency){  
        this.getPayees();
      }
      this.getCoinDetails()
    }

    loadPermissions = () => {
		if (this.props.withdrawCryptoPermissions) {
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.withdrawCryptoPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, permissions: _permissions });
		}
	}

    getCoinDetails=async()=>{
   let response=await getCoinwithBank()
   if(response.ok){
    let obj=response.data
   }
    }
    getPayees() {
        fetchPayees(this.props.userProfile.id, this.state.selectedCurrency).then((response) => {
            if (response.ok) {
                this.setState({ ...this.state, payeesLoading: false, filterObj: response.data, payees: response.data });
            }
        });
        fetchPastPayees(this.props.userProfile.id, this.state.selectedCurrency).then((response) => {
            if (response.ok) {
                this.setState({ ...this.state, pastPayees: response.data });
            }
        });
    }
    verificationCheck = async () => {
        this.setState({ ...this.state, isVarificationLoader: true })
        const verfResponse = await getVerificationFields(this.props.userProfile.id);
        let minVerifications = 0;
        if (verfResponse.ok) {
            for (let verifMethod in verfResponse.data) {
                if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] === true) {
                    minVerifications = minVerifications + 1;
                }
            }
            if (minVerifications >= 2) {
                this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: true })
            } else {
                this.setState({ ...this.state, isVarificationLoader: false, isVerificationEnable: false })
            }
        } else {
            this.setState({ ...this.state, isVarificationLoader: false, errorMessage: this.isErrorDispaly(verfResponse) })
        }
    }
    chnageStep = (step, values) => {
        this.setState({ ...this.state, step, onTheGoObj: values  });
        if (step === 'newtransfer') {
            this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
        }
    }
    amountnext = (values) => {
        let _amt = values.amount;
        _amt = _amt.replace(/,/g, "");
        if(_amt>0){
        this.setState({ ...this.state, amount: _amt }, () => this.validateAmt(_amt, "newtransfer", values, "newtransferLoader"))
        }else{
            if(!_amt){
                this.setState({ ...this.state, errorMessage:''});
            }else{
            this.setState({ ...this.state, errorMessage:'Amount must be greater than zero'});}
        }
    }
    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const filterObj = this.state.payees.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, filterObj, searchVal: val });
        }
        else
            this.setState({ ...this.state, filterObj: this.state.payees,searchVal: val });
    }
    handleFiatSearch = ({ target: { value: val } }) => {
        if (val) {
            const fiatWallets = this.state.filtercoinsList?.filter(item => item.walletCode.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, fiatWallets, searchFiatVal: val });
        }
        else
            this.setState({ ...this.state, fiatWallets: this.state.filtercoinsList, searchFiatVal: val });
    }
    saveWithdrawdata = async () => {
        this.setState({ ...this.state, isBtnLoading: true })
        if (this.state.verifyData?.verifyData) {
            if (this.state.verifyData.verifyData.isPhoneVerified) {
                if (!this.state.verifyData.isPhoneVerification) {
                    this.setState({
                        ...this.state,
                        errorMessage: "Please verify phone verification code"
                    });
                    this.reviewScrool.current.scrollIntoView()
                    return;
                }
            }
            if (this.state.verifyData.verifyData.isEmailVerification) {
                if (!this.state.verifyData.isEmailVerification) {
                    this.setState({
                        ...this.state,
                        errorMessage: "Please verify  email verification code"
                    });
                    this.reviewScrool.current.scrollIntoView()
                    return;
                }
            }
            if (this.state.verifyData.verifyData.twoFactorEnabled) {
                if (!this.state.verifyData.isAuthenticatorVerification) {
                    this.setState({
                        ...this.state,
                        errorMessage: "Please verify authenticator code"
                    });
                    this.reviewScrool.current.scrollIntoView()
                    return;
                }
            }
            if (
                this.state.verifyData.verifyData.isPhoneVerified == "" &&
                this.state.verifyData.verifyData.isEmailVerification == "" &&
                this.state.verifyData.verifyData.twoFactorEnabled == ""
            ) {
                this.setState({
                    ...this.state,
                    errorMessage:
                        "Without Verifications you can't send. Please select send verifications from security section",
                });
                this.reviewScrool.current.scrollIntoView()
                return
            }
        } else {
            this.setState({
                ...this.state,
                errorMessage:
                    "Without Verifications you can't Proceed.",
            });
            this.reviewScrool.current.scrollIntoView()
            return
        }
        if (this.state.reviewDetails) {
            let obj = Object.assign({}, this.state.reviewDetails);
            obj["accountNumber"] = obj.accountNumber ? apicalls.encryptValue(obj.accountNumber, this.props.userProfile?.sk) : null;
            obj["bankName"] = obj.bankName ? apicalls.encryptValue(obj.bankName, this.props.userProfile?.sk) : null;
            obj["bankAddress"] = obj.bankAddress ? apicalls.encryptValue(obj.bankAddress, this.props.userProfile?.sk) : null;
            obj["beneficiaryAccountName"] = obj.beneficiaryAccountName ? apicalls.encryptValue(obj.beneficiaryAccountName, this.props.userProfile?.sk) : null;
            obj["beneficiaryAccountAddress"] = obj.beneficiaryAccountAddress ? apicalls.encryptValue(obj.beneficiaryAccountAddress, this.props.userProfile?.sk) : null;
            obj["routingNumber"] = obj.routingNumber ? apicalls.encryptValue(obj.routingNumber, this.props.userProfile?.sk) : null;

            const saveRes = await saveWithdraw(obj)
            if (saveRes.ok) {
                this.chnageStep(this.state.isNewTransfer ? "declaration" : "successpage")
                this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
                this.props.dispatch(fetchMarketCoinData(true))
                this.setState({ ...this.state, isBtnLoading: false })
            } else {
                this.setState({
                    ...this.state,
                    errorMessage: this.isErrorDispaly(saveRes), isBtnLoading: false
                });
            }
        }
    }
    changesVerification = (obj) => {
        if(obj.isPhoneVerification&&obj.isEmailVerification&&(obj.verifyData?.isPhoneVerified&&obj.verifyData?.isEmailVerification&&!obj.verifyData?.twoFactorEnabled)) {
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else if(obj.isPhoneVerification&&obj.isAuthenticatorVerification&&(obj.verifyData?.isPhoneVerified&&obj.verifyData?.twoFactorEnabled&&!obj.verifyData?.isEmailVerification)) {
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else if(obj.isAuthenticatorVerification&&obj.isEmailVerification&&(obj.verifyData?.twoFactorEnabled&&obj.verifyData?.isEmailVerification&&!obj.verifyData?.isPhoneVerified)) {
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else if(obj.isPhoneVerification&&obj.isAuthenticatorVerification&&obj.isEmailVerification&&(obj.verifyData?.isPhoneVerified&&obj.verifyData?.twoFactorEnabled&&obj.verifyData?.isEmailVerification)){
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else if(obj.verifyData?.isLiveVerification&&obj.isEmailVerification&&!obj.verifyData?.isPhoneVerified&&!obj.verifyData?.twoFactorEnabled&&obj.verifyData?.isEmailVerification){
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else if(obj.verifyData?.isLiveVerification&&obj.isPhoneVerification&&!obj.verifyData?.twoFactorEnabled&&!obj.verifyData?.isEmailVerification&&obj.verifyData?.isPhoneVerified){
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
        else {
        if(obj.verifyData?.isLiveVerification&&obj.isAuthenticatorVerification&&!obj.verifyData?.isPhoneVerified&&!obj.verifyData?.isEmailVerification&&obj.verifyData?.twoFactorEnabled){
            this.setState({ ...this.state, isShowGreyButton: true, verifyData: obj});
        }
       }
       
    }
    isErrorDispaly = (objValue) => {
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
    onReviewDetailsLoading = (val) => {
        this.setState({ ...this.state, reviewDetailsLoading: val })
    }
    validateAmt = async (amt, step, values, loader) => {
        this.getPayees();
        const obj = {
            CustomerId: this.props.userProfile?.id,
            amount: amt,
            WalletCode: this.state.selectedCurrency
        }
        this.setState({ ...this.state, [loader]: true, errorMessage: null });
        const res = await validateAmount(obj);
        if (res.ok) {
            this.setState({ ...this.state, [loader]: false, errorMessage: null }, () => this.chnageStep(step, values));
        } else {
            this.setState({ ...this.state, [loader]: false, errorMessage: this.isErrorDispaly(res) })
        }

    }

    handleCurrencyChange =(e) => {
        this.setState({ ...this.state, selectedCurrency: e});
    }
 
    renderStep = (step) => {
        const { filterObj, pastPayees, payeesLoading, isVarificationLoader, isVerificationEnable,isPhMail,isShowGreyButton,isAuthMail } = this.state;
        const steps = {
            selectcurrency: <React.Fragment>
                {this.state.fiatWalletsLoading && <Loader />}
                {!this.state.fiatWalletsLoading && <div>
                <div className="mt-8">
                    <Title
                        className='sub-heading code-lbl'>Send from your Suissebase FIAT Wallet</Title>
                </div>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Search placeholder="Search Currency" value={this.state.searchFiatVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleFiatSearch} size="middle" bordered={false} className="text-center mb-16" />
                </Col>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.fiatWallets}
                    className="crypto-list auto-scroll wallet-list"
                    loading={this.state.fiatWalletsLoading}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Translate content="No_data" />
                        } />
                    }}
                    renderItem={item => (

                        <List.Item onClick={() => this.setState({ ...this.state, selectedCurrency: item.walletCode }, () => {this.getPayees(); this.chnageStep("enteramount")})}>
                            <Link>
                                <List.Item.Meta
                                    avatar={<Image preview={false} src={item.imagePath} />}

                                    title={<div className="wallet-title">{item.walletCode}</div>}
                                />
                                <><div className="text-right coin-typo">
                                    <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
                </div>}
            </React.Fragment>,
            enteramount: <>
                {isVarificationLoader && <Loader />}
                {!isVarificationLoader && 
                    <Form
                        autoComplete="off"
                        initialValues={{ amount: "" }}
                        ref={this.enteramtForm}
                        onFinish={this.amountnext}
                        scrollToFirstError
                    >
                       {!isVerificationEnable &&
                            <Alert
                                message="Verification alert !"
                                description={<Text>Without verifications you can't send. Please select send verifications from <a onClick={() => {
                                    this.props.history.push("/userprofile/2")
                                }}>security section</a></Text>}
                                type="warning"
                                showIcon
                                closable={false}
                            />
                        }
                        {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                        {isVerificationEnable && <>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                    <Form.Item
                                        className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label fund-transfer-input send-fiat-input"
                                        name="amount"
                                        label={"Enter Amount"}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:'Is required',
                                            },
                                            {
                                                validator: (_, value) => {
                                                    const reg = /.*[0-9].*/g;
                                                    if (value && !reg.test(value)) {
                                                        return Promise.reject("Invalid amount");
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                    >
                                        <NumberFormat
                                            customInput={Input}
                                            className="cust-input cust-select-arrow tfunds-inputgroup"
                                            placeholder={"Enter Amount"}
                                            maxLength="13"
                                            decimalScale={2}
                                            displayType="input"
                                            allowNegative={false}
                                            thousandSeparator={","}
                                             addonBefore={<Select  defaultValue={this.state.selectedCurrency}
                                                onChange={(e) => this.handleCurrencyChange(e)}
                                                placeholder="Select">
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </Select>}
                                            onValueChange={() => {
                                                this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount,errorMessage:'' })
                                            }}
                                        />
                                      
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} className="mt-16">

                                <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="mobile-viewbtns">
                                    <Form.Item className="text-center">
                                        <Button
                                            htmlType="submit"
                                            size="large"
                                            className="pop-btn mb-36"
                                            style={{ width: '100%' }}
                                            loading={this.state.newtransferLoader}
                                            disabled={this.state.addressLoader}
                                       >
                                            New Transfer
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="mobile-viewbtns">
                                    <Form.Item className="text-center">
                                        <Button
                                           htmlType="button"
                                            size="large"
                                            className="pop-btn mb-36"
                                            style={{ width: '100% '}}
                                            loading={this.state.addressLoader}
                                            disabled={this.state.newtransferLoader}
                                            onClick={() => {
                                                let _amt = this.enteramtForm.current.getFieldsValue().amount;
                                                _amt = _amt.replace(/,/g, "");
                                                if(_amt>0){
                                                this.setState({ ...this.state, isNewTransfer: false, amount: _amt,onTheGoObj:this.enteramtForm.current.getFieldsValue() }, () => {
                                                    this.enteramtForm.current.validateFields().then(() => this.validateAmt(_amt, "addressselection", this.enteramtForm.current.getFieldsValue(), "addressLoader"))
                                                        .catch(error => {

                                                        });
                                                })
                                            }else{
                                                if(!_amt){
                                                    this.enteramtForm.current.validateFields()
                                                }else{
                                                    this.setState({ ...this.state, errorMessage:'Amount must be greater than zero'})
                                                }
                                            }
                                            }}
                                        >
                                            Address book
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>}
                    </Form>}</>,
            addressselection: <React.Fragment>
                {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                <div className="mt-8">
                    <Title
                        className='sub-heading code-lbl'>Who are you sending money to?</Title>
                </div>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>

                    <Search placeholder="Search for Payee" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className=" text-center" />
                </Col>
                {this.state?.loading && <Loader />}
                {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                    <Divider className="cust-divide" />

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(filterObj.length > 0) && filterObj?.map((item, idx) =>
                            <>{<Row className="fund-border c-pointer" onClick={async () => {
                                if (!["myself", "1stparty", 'ownbusiness'].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } }, () => this.chnageStep("reasonfortransfer"));
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } });
                                    const res = await confirmTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => this.chnageStep("reviewdetails"));
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={6} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={14} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz c-pointer">{item.name}</label>
                                    {item.accountNumber && <div><Text className="fs-14 text-white-30 m-0">{this.state.selectedCurrency} account ending with {item.accountNumber?.substr(item.accountNumber.length - 4)}</Text></div>}
                                </Col>
                                <Col xs={4} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>}</>
                        )}
                        {(!filterObj.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {apicalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a>
                        </div>}
                    </ul>

                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Past Recipients</Title>
                    <Divider className="cust-divide" />
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(pastPayees.length > 0) && pastPayees?.map((item, idx) =>
                            <Row className="fund-border c-pointer" onClick={async () => {
                                if (!["myself", "1stparty", "ownbusiness"].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item }, () => this.chnageStep("reasonfortransfer"))
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                                    const res = await confirmTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => this.chnageStep("reviewdetails"));
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={6} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={14} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz c-pointer">{item.name}</label>
                                    <div><Text className="fs-14 text-white-30 m-0">{this.state.selectedCurrency} account ending with {item.accountNumber?.substr(item.accountNumber?.length - 4)}</Text></div>
                                </Col>
                                <Col xs={4} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>

                        )}
                        {(!pastPayees.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {'You have no past recipients'} </p>
                            {/* <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a> */}
                        </div>}
                    </ul>
                </>}

            </React.Fragment>,
            reasonfortransfer: <React.Fragment>
                <div className="mb-16" style={{textAlign:'center'}}>
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 mb-16 mt-4'style={{ fontSize: '18px ' }}>Transfer Details</text>
                </div>
                <Form
                    autoComplete="off"
                    initialValues={this.state.codeDetails}
                    ref={this.reasonForm}
                >
                    {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <React.Fragment><Row gutter={[16, 16]} style={{marginBottom:16}}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="fw-300 mb-4 text-white-50 py-4 custom-forminput custom-label"
                                name="reasionOfTransfer"
                                label={"Reason For Transfer"}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            apicalls.convertLocalLang("is_required"),
                                    }
                                ]}
                            >
                                <Input
                                    className="cust-input "
                                    placeholder={"Reason For Transfer"}
                                    maxLength={200}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                        <AddressDocumnet documents={this.state.codeDetails.documents} onDocumentsChange={(docs) => {
                            let { documents } = this.state.codeDetails;
                            documents = docs;
                            this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, documents } })
                        }} title={"Please upload supporting docs to explain relationship with beneficiary*"} />
                    </React.Fragment>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item className="text-center">
                                <Button
                                    htmlType="button"
                                    size="large"
                                    className="pop-btn mb-36 mt-36"
                                    loading={this.state.loading}
                                    style={{ width: "100%" }}
                                    onClick={() => {
                                        let validateFileds = [];
                                        if (!["myself", "1stparty", "ownbusiness"].includes(this.state.selectedPayee.addressType?.toLowerCase())) {
                                            validateFileds = validateFileds.concat(["reasionOfTransfer", "files"]);
                                        }
                                        this.reasonForm.current.validateFields(validateFileds).then(async () => {
                                            const fieldValues = this.reasonForm.current.getFieldsValue();
                                            this.setState({ ...this.state, loading: true, errorMessage: null });
                                            const obj = {
                                                "payeeId": this.state.selectedPayee.id,
                                                "customerId": this.props.userProfile.id,
                                                "reasonOfTransfer": fieldValues?.reasionOfTransfer,
                                                "routingNumber": fieldValues?.abaRoutingCode,
                                                "isInternational": null,
                                                "documents": this.state.codeDetails?.documents
                                            }
                                            const res = await confirmTransaction({ payeeId: this.state.selectedPayee.id, reasonOfTransfer: fieldValues.reasionOfTransfer, amount: this.state.amount, documents: this.state.codeDetails?.documents });
                                            if (res.ok) {
                                                this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => this.chnageStep("reviewdetails"));
                                            } else {
                                                this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, ...fieldValues }, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                            }

                                        }).catch(() => { });
                                    }}
                                >
                                    Next
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>,
            reviewdetails: <React.Fragment>
                <div ref={this.reviewScrool}></div>
                <div className="mb-16 text-center">
                    <text Paragraph
                        className='fs-24 fw-600 text-white mb-16 mt-4'>Review Details Of Transfer</text>
                </div>
                <Spin spinning={this.state.reviewDetailsLoading}>
                    <Form
                        name="advanced_search"
                        ref={this.formRef}
                        onFinish={this.transferDetials}
                        autoComplete="off">
                        {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}

                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Text className="fw-600 text-white mt-4 text-captz"style={{ fontSize: '18px' }}>Transfer details</Text>
                                </div>
                            </Col>
                            {"  "}
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">How much you will receive</Title>
                                    <Title className="fs-14 text-white fw-500 text-upper text-right">
                                        <NumberFormat
                                            value={`${(this.state.reviewDetails?.requestedAmount - this.state.reviewDetails?.comission)}`}
                                            thousandSeparator={true} displayType={"text"}  decimalPlaces={2}/> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">Total fees</Title>
                                    <Title className="fs-14 text-white fw-500 text-upper text-right"><NumberFormat
                                        value={`${(this.state.reviewDetails?.comission)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">Withdrawal amount</Title>
                                    <Title className="fs-14 text-white fw-500 text-upper text-right"><NumberFormat
                                        value={`${(this.state.reviewDetails?.requestedAmount)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={24} className=" text-white mt-36">
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24} >
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Text className="fw-600 text-white mb-0 mt-4 text-captz" style={{ fontSize: '18px' }}>Recipient details</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">Save Whitelist name as</Title>
                                   <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.favouriteName}</Title>
                                </div>
                            </Col>
                            {this.state.reviewDetails?.name && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">Beneficiary Name</Title>
                                    <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.name}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.firstName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">First Name</Title>
                                   <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.firstName}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.lastName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">Last Name</Title>
                                    <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.lastName}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.iban && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">IBAN </Title>
                                    <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.iban}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.customerRemarks && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">Reason For Transfer </Title>
                                    <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.customerRemarks || "-"}</Title>
                                </div>
                            </Col>}
                            
                                {this.state.reviewDetails?.abaRoutingCode && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                        <Title className="fs-14 text-white fw-500 text-captz">ABA Routing code</Title>
                                        <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.abaRoutingCode || "-"}</Title>
                                    </div>
                                </Col>}
                                {this.state.reviewDetails?.swiftRouteBICNumber && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">SWIFT / BIC Code</Title>
                                        <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.swiftRouteBICNumber || "-"}</Title>
                                    </div>
                                </Col>}
                                {this.state.reviewDetails?.accountNumber && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                    <Title className="fs-14 text-white fw-500 text-captz">Account Number </Title>
                                         <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state.reviewDetails?.accountNumber || "-"}</Title>
                                    </div>
                                </Col>}
                            {this.state.reviewDetails?.bankName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-500 text-captz">Bank Name </Title>
                                    <Title className="fs-14 fw-500 text-white text-right plist-textwrap">{this.state?.reviewDetails?.bankName || "-"}</Title>
                                </div>
                            </Col>}
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} />
                            </Col>
                           {this.state.permissions?.Send && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="text-right mt-36 create-account">
                                    <Form.Item className="mb-0 mt-16">
                                        <Button
                                            htmlType="button"
                                            onClick={() => { this.saveWithdrawdata(); }}
                                            size="large"
                                            block
                                            className="pop-btn custom-send"
                                             style ={{backgroundColor: !isShowGreyButton  &&'#ccc',borderColor: !isShowGreyButton  &&'#3d3d3d'}}
                                           loading={this.state.isBtnLoading} >
                                            Confirm & Continue
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>}
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>,
            newtransfer: <>
                <FiatAddress typeOntheGo={this.props?.ontheGoType} currency={this.state.selectedCurrency} amount={this.state.amount} onContinue={(obj) => {
                    this.setState({ ...this.state, reviewDetails: obj }, () => {
                        this.chnageStep("reviewdetails")
                    })
                }
                }
                    onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} onTheGoObj={this.state.onTheGoObj} />
            </>,
            declaration:  <div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                       Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
            </div></div>,
            successpage:<div className="custom-declaraton"> <div className="text-center mt-36 declaration-content">
                <Image width={80} preview={false} src={success} />
                <Title level={2} className="text-white-30 my-16 mb-0">Your transaction has been processed successfully</Title>
            </div></div>
        }
        return steps[this.state.step];
    }
    render() {
        return <React.Fragment>
            {this.renderStep()}
        </React.Fragment>
    }
}
const connectStateToProps = ({ sendReceive, userConfig, menuItems,oidc }) => {
	return {
		sendReceive,
		userProfile: userConfig?.userProfileInfo,
		trackAuditLogData: userConfig?.trackAuditLogData,
		withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,
		oidc:oidc?.user?.profile
	};
};
const connectDispatchToProps = dispatch => {
    return {
        changeInternalStep: (stepcode) => {
            // dispatch(setInternalStep(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps,connectDispatchToProps)(withRouter(OnthegoFundTransfer));