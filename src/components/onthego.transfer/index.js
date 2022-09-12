import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, List, Divider, Image, Alert, Spin, Empty } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png';
import NumberFormat from "react-number-format";
import ConnectStateProps from "../../utils/state.connect";
import { fetchPayees, fetchPastPayees, confirmTransaction, updatePayee, document, saveWithdraw, validateAmount } from "./api";
import Loader from "../../Shared/loader";
import Search from "antd/lib/input/Search";
import Verifications from "./verification.component/verifications"
import { getVerificationFields } from "./verification.component/api"
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { fetchMemberWallets } from "../dashboard.component/api";
import Translate from "react-translate-component";
import { Link } from "react-router-dom";
const { Text, Title } = Typography;

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
        fiatWallets: []
    }
    componentDidMount() {
        this.verificationCheck()
        if (!this.state.selectedCurrency) {
            this.setState({ ...this.state, fiatWalletsLoading: true });
            fetchMemberWallets(this.props?.userProfile?.id).then(res => {
                if (res.ok) {
                    this.setState({ ...this.state, fiatWallets: res.data, fiatWalletsLoading: false });
                } else {
                    this.setState({ ...this.state, fiatWallets: [], fiatWalletsLoading: false });
                }
            });
        }
      if(this.state.selectedCurrency){
        this.getPayees();
      }
    }
    getPayees() {
        debugger
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
        this.setState({ ...this.state, step });
        if (step === 'newtransfer') {
            this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
        }
    }
    amountnext = (values) => {
        let _amt = values.amount;
        _amt = _amt.replace(/,/g, "");
        this.setState({ ...this.state, amount: _amt }, () => this.validateAmt(_amt, "newtransfer", values, "newtransferLoader"))

    }
    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const filterObj = this.state.payees.filter(item => item.name.toLowerCase().includes(val));
            this.setState({ ...this.state, filterObj, searchVal: val });
        }
        else
            this.setState({ ...this.state, filterObj: this.state.payees });
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
                    "Without Verifications you can't Procced.",
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
        this.setState({ ...this.state, verifyData: obj })
        console.log(obj)
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
    renderStep = (step) => {
        const { filterObj, pastPayees, payeesLoading, isVarificationLoader, isVerificationEnable } = this.state;
        const steps = {
            selectcurrency: <React.Fragment>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.fiatWallets}
                    className="crypto-list auto-scroll wallet-list c-pointer"
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
                                    {item.amount !== 0 && <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />}

                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
            </React.Fragment>,
            enteramount: <>
                <div className="mb-16 text-left">
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 '>Transfer funds</text>
                </div>
                <Spin spinning={isVarificationLoader}>
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
                                    this.props.history.push("/userprofile?key=2")
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
                                        className="custom-forminput custom-label mb-0 fund-transfer-input"
                                        name="amount"
                                        label={"Enter Amount"}
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    apicalls.convertLocalLang("is_required"),
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
                                            className="cust-input"
                                            placeholder={"Enter Amount"}
                                            maxLength="13"
                                            decimalScale={2}
                                            displayType="input"
                                            allowNegative={false}
                                            thousandSeparator={","}
                                            addonBefore={this.state.selectedCurrency}
                                            onValueChange={() => {
                                                this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount })
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>

                                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                    <br />
                                    <Form.Item className="text-center">
                                        <Button
                                            htmlType="submit"
                                            size="large"
                                            className="pop-btn mb-36"
                                            style={{ minWidth: 300 }}
                                            loading={this.state.newtransferLoader}
                                            disabled={this.state.addressLoader}
                                        >
                                            New Transfer
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                                    <br />
                                    <Form.Item className="text-center">
                                        <Button
                                            htmlType="button"
                                            size="large"
                                            className="pop-btn mb-36"
                                            style={{ minWidth: 300 }}
                                            loading={this.state.addressLoader}
                                            disabled={this.state.newtransferLoader}
                                            onClick={() => {
                                                let _amt = this.enteramtForm.current.getFieldsValue().amount;
                                                _amt = _amt.replace(/,/g, "");
                                                this.setState({ ...this.state, isNewTransfer: false, amount: _amt }, () => {
                                                    this.enteramtForm.current.validateFields().then(() => this.validateAmt(_amt, "addressselection", this.enteramtForm.current.getFieldsValue(), "addressLoader"))
                                                        .catch(error => {

                                                        });
                                                })
                                            }}
                                        >
                                            Address book
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>}
                    </Form></Spin></>,
            addressselection: <React.Fragment>
                {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                <div className="mb-16 text-left">
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 '>Who are you sending money to?</text>
                </div>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>

                    {/* <Form.Item
                        name="lastName"
                        label={"Search for Payee"}
                        colon={false}
                    >
                        <Search
                            placeholder="Search for Payee" bordered={false} showSearch
                            className=" "
                            onChange={this.handleSearch}
                            value={this.state.searchVal}
                        />
                    </Form.Item> */}
                    <Search placeholder="Search for Payee" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="mt-12" />
                </Col>
                {this.state?.loading && <Loader />}
                {(!this.state.loading) && <>
                    <Title className="fs-24 fw-600 text-white mt-24">Address Book</Title>
                    <Divider className="cust-divide" />

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(filterObj.length > 0) && filterObj?.map((item, idx) =>
                            <Row className="fund-border c-pointer " onClick={async () => {
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
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-400 text-white">
                                        <strong>{item.name}
                                            {/* <small>{item.type}</small> */}
                                        </strong>
                                    </label>
                                    {item.accountNumber && <div><Text className="fs-14 fw-400 text-white">{this.state.selectedCurrency} account ending with {item.accountNumber.substr(item.accountNumber.length - 4)}</Text></div>}
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>
                        )}
                        {(!filterObj.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {apicalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a>
                        </div>}
                    </ul>

                    <Title className="fs-24 fw-600 text-white">Past Recipients</Title>
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
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="fs-16 fw-400 text-white">
                                        <strong>{item.name}
                                            {/* <small>{item.type}</small> */}
                                        </strong>
                                    </label>
                                    <div><Text className="fs-14 fw-400 text-white">{this.state.selectedCurrency} account ending with {item.accountNumber.substr(item.accountNumber.length - 4)}</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>

                        )}
                        {(!pastPayees.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {'You have no past recipients'} </p>
                            <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a>
                        </div>}
                    </ul>
                </>}

            </React.Fragment>,
            reasonfortransfer: <React.Fragment>
                <div className="mb-16 text-left">
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 '>Transfer Details</text>
                </div>
                <Form
                    autoComplete="off"
                    initialValues={this.state.codeDetails}
                    ref={this.reasonForm}
                >
                    {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
                    <React.Fragment><Row gutter={[16, 16]}>
                        <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                            <Form.Item
                                className="custom-forminput custom-label mb-0"
                                name="reasionOfTransfer"
                                label={"Reason of Transfer"}
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
                                    placeholder={"Reason of Transfer"}
                                    maxLength="500"
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                        <AddressDocumnet documents={this.state.codeDetails.documents} onDocumentsChange={(docs) => {
                            let { documents } = this.state.codeDetails;
                            documents = docs;
                            this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, documents } })
                        }} title={"Upload supporting documents for transaction"} />
                    </React.Fragment>
                    {/* {this.state.selectedCurrency === "USD" && <Tabs className="cust-tabs-fait" activeKey={this.state.selectedTab} onChange={(key) => this.setState({ ...this.state, selectedTab: key })}>
                        <Tabs.TabPane tab="Domestic USD transfer" className="text-white" key={"domestic"}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                    <Form.Item
                                        className="custom-forminput custom-label mb-0"
                                        name="abaRoutingCode"
                                        label={"ABA Routing COde"}
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
                                            placeholder={"ABA Routing Code"}
                                            maxLength="500"
                                        />
                                    </Form.Item>

                                </Col>
                            </Row>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="International USD Swift" key={"international"} className="text-white">
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                                <Form.Item
                                    className="custom-forminput custom-label mb-0"
                                    name="swiftRouteBICNumber"
                                    label={"Swift / BIC Code"}
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
                                        placeholder={"Swift / BIC Code"}
                                        maxLength="500"
                                    />
                                </Form.Item>

                            </Col>
                        </Tabs.TabPane>
                    </Tabs>} */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6} lg={6} xl={6} xxl={6}></Col>
                        <Col xs={24} md={12} lg={12} xl={12} xxl={12}>
                            <br />
                            <Form.Item className="text-center">
                                <Button
                                    htmlType="button"
                                    size="large"
                                    className="pop-btn mb-36"
                                    loading={this.state.loading}
                                    style={{ minWidth: 300 }}
                                    onClick={() => {
                                        let validateFileds = [];
                                        // if (this.state.selectedCurrency === "USD") {
                                        //     const code = this.state?.selectedTab === "domestic" ? "abaRoutingCode" : "swiftRouteBICNumber";
                                        //     validateFileds.push(code);
                                        // }
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
                                            // updatePayee(obj)
                                            //     .then(async (response) => {
                                            //         this.setState({ ...this.state, loading: true, errorMessage: null });
                                            //         if (response.ok) {
                                            const res = await confirmTransaction({ payeeId: this.state.selectedPayee.id, reasonOfTransfer: fieldValues.reasionOfTransfer, amount: this.state.amount, documents: this.state.codeDetails?.documents });
                                            if (res.ok) {
                                                this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => this.chnageStep("reviewdetails"));
                                            } else {
                                                this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, ...fieldValues }, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                            }
                                            //     } else {
                                            //         this.setState({ ...this.state, codeDetails: { ...this.state.codeDetails, ...fieldValues }, loading: false, errorMessage: response.data?.message || response.data || response.originalError.message });
                                            //     }
                                            // })

                                        }).catch(() => { });
                                    }}
                                >
                                    Next
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6} lg={6} xl={6} xxl={6}></Col>
                    </Row>
                </Form>
            </React.Fragment>,
            reviewdetails: <React.Fragment>
                <div ref={this.reviewScrool}></div>
                <div className="mb-16 text-center">
                    <text Paragraph
                        className='text-white fs-30 fw-600 px-4 '>Review Details Of Transfer</text>
                </div>
                <Spin spinning={this.state.reviewDetailsLoading}>
                    <Form
                        name="advanced_search"
                        ref={this.formRef}
                        onFinish={this.transferDetials}
                        autoComplete="off">
                        {/* <div className="text-center"> <text Paragraph
                        className='text-white fs-24 fw-600 mb-16 px-4 '>Review Details Of Transfer</text></div> */}
                        {this.state.errorMessage && <Alert type="error" showIcon closable={false} description={this.state.errorMessage} />}

                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Text className="mb-8 fs-14 text-white fw-500  mt-16">Transfer details</Text>

                                    {/* <div><Link >Edit
                                </Link>
                                </div> */}
                                </div>
                            </Col>
                            {"  "}
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  mt-16">How much you will receive</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500  mt-16  text-right">
                                        <NumberFormat
                                            value={`${(this.state.reviewDetails?.requestedAmount - this.state.reviewDetails?.comission)}`}
                                            thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Total fees</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right"><NumberFormat
                                        value={`${(this.state.reviewDetails?.comission)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                            {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400  ">Total we will convert</Title>
                                <Title className="mb-4 fs-10 text-white fw-500   text-right"></Title>
                            </div>
                        </Col> */}
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Withdrawal amount</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right"><NumberFormat
                                        value={`${(this.state.reviewDetails?.requestedAmount)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                                </div>
                            </Col>
                            {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                <Title className="mb-4 fs-10 text-white fw-400  ">Description</Title>
                                <Title className="mb-4 fs-10 text-white fw-500   text-right">Bike</Title>
                            </div>
                        </Col> */}
                        </Row>

                        <Row gutter={24} className=" text-white mt-36">
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24} >
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Text className="mb-8 fs-14 text-white fw-500  mt-16">Recipient details</Text>

                                    {/* <div><Link >Change
                                </Link>
                                </div> */}
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  mt-16">Save Whitelist name as</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500  mt-16  text-right">{this.state.reviewDetails?.favouriteName}</Title>
                                </div>
                            </Col>
                            {this.state.reviewDetails?.name && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Beneficiary Name</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.name}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.firstName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">First Name</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.firstName}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.lastName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Last Name</Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.lastName}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.iban && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">IBAN </Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.iban}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.customerRemarks && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Reason of Transfer </Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.customerRemarks || "-"}</Title>
                                </div>
                            </Col>}
                            {this.state.reviewDetails?.addressType == "someoneelse" && this.state.reviewDetails?.transferType != "sepa" && <>
                                {this.state.reviewDetails?.abaRoutingCode && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                        <Title className="mb-4 fs-10 text-white fw-400  ">ABA Routing code</Title>
                                        <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.abaRoutingCode || "-"}</Title>
                                    </div>
                                </Col>}
                                {this.state.reviewDetails?.swiftRouteBICNumber && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                        <Title className="mb-4 fs-10 text-white fw-400  ">SWIFT / BIC Code</Title>
                                        <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.swiftRouteBICNumber || "-"}</Title>
                                    </div>
                                </Col>}
                                {this.state.reviewDetails?.accountNumber && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                    <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                        <Title className="mb-4 fs-10 text-white fw-400  ">Account Number </Title>
                                        <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state.reviewDetails?.accountNumber || "-"}</Title>
                                    </div>
                                </Col>}</>}
                            {this.state.reviewDetails?.bankName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="d-flex  justify-content" style={{ alignItems: 'baseline' }}>
                                    <Title className="mb-4 fs-10 text-white fw-400  ">Bank Name </Title>
                                    <Title className="mb-4 fs-10 text-white fw-500   text-right">{this.state?.reviewDetails?.bankName || "-"}</Title>
                                </div>
                            </Col>}
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <Verifications onchangeData={(obj) => this.changesVerification(obj)} onReviewDetailsLoading={(val) => this.onReviewDetailsLoading(val)} />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                                <div className="text-center mt-36 create-account">
                                    <Form.Item className="mb-0 mt-16">
                                        <Button
                                            htmlType="button"
                                            onClick={() => { this.saveWithdrawdata(); }}
                                            size="large"
                                            block
                                            className="pop-btn px-24"
                                            loading={this.state.isBtnLoading} >
                                            Confirm & Continue
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>,
            newtransfer: <>
                <FiatAddress currency={this.state.selectedCurrency} amount={this.state.amount} onContinue={(obj) => {
                    this.setState({ ...this.state, reviewDetails: obj }, () => {
                        this.chnageStep("reviewdetails")
                    })
                }
                }
                    onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} onTheGoObj={this.state.onTheGoObj} />
            </>,
            declaration: <div className="text-center">
                <Image width={80} preview={false} src={alertIcon} />
                <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully to your email</Title>
                <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                       Please sign using link received in email to whitelist your address. `}</Text>
                <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
                {/*<div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBOARD</Button> */}
            </div>,
            successpage: <div className="text-center">
                <Image width={80} preview={false} src={success} />
                <Title level={2} className="text-white-30 my-16 mb-0">Your transaction has been processed successfully</Title>
                {/* <Text className="text-white-30">{`Declaration form has been sent to ${"have123@yopmail.com"}. 
                   Please sign using link received in email to whitelist your address`}</Text> */}
                {/*<div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBOARD</Button> */}
            </div>
        }
        return steps[this.state.step];
    }
    render() {
        return <React.Fragment>
            {this.renderStep()}
        </React.Fragment>
    }
}
export default ConnectStateProps(withRouter(OnthegoFundTransfer));