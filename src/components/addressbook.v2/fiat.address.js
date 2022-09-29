import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, List, Divider, Image, Select, Tabs, Alert,Empty } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png'
import FiatAddress from "../addressbook.component/fiat.address";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png';
import NumberFormat from "react-number-format";
import ConnectStateProps from "../../utils/state.connect";
import { fetchPayees, fetchPastPayees, confirmTransaction, updatePayee, document, saveWithdraw, validateAmount } from "../onthego.transfer/api";
import Loader from "../../Shared/loader";
import Search from "antd/lib/input/Search";
import Verifications from "../onthego.transfer/verification.component/verifications"
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import {fetchMemberWallets} from '../dashboard.component/api'
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;

class AddressBookV2 extends Component {
    enteramtForm = React.createRef();
    reasonForm = React.createRef();
    reviewScrool = React.createRef();
    state = {
        step: "currencySelection",
        filterObj: [],
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
        phBtn:false,
        emailBtn:false,
        authBtn:false,
        codeDetails: { abaRoutingCode: "", swiftRouteBICNumber: "", reasionOfTransfer: "", documents: null },
        selectedPayee: {},
        selectedTab: "domestic",
        verifyData: null, isBtnLoading: false,loader:true,currency:null
    }
    componentDidMount() {
        fetchPayees(this.props.userProfile.id, this.props.selectedCurrency).then((response) => {
            if (response.ok) {
                this.setState({ ...this.state, payeesLoading: false, filterObj: response.data, payees: response.data });
            }
        });
        fetchPastPayees(this.props.userProfile.id, this.props.selectedCurrency).then((response) => {
            if (response.ok) {
                this.setState({ ...this.state, pastPayees: response.data });
            }
        });
        fetchMemberWallets(this.props.userProfile.id).then((response) => {
            if (response.ok) {
                this.setState({ ...this.state, coinListData: response.data,loader:false });
            }
        });
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
                    "Without Verifications you can't Proceed.",
            });
            this.reviewScrool.current.scrollIntoView()
            return
        }
        if (this.state.reviewDetails) {
            let obj = Object.assign({},this.state.reviewDetails);
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
        this.setState({ ...this.state, verifyData: obj,phBtn:obj.phBtn,emailBtn:obj.emailBtn,authBtn:obj.authBtn })
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
    validateAmt = async (amt, step, values, loader) => {
        const obj = {
            CustomerId: this.props.userProfile?.id,
            amount: amt,
            WalletCode: this.props.selectedCurrency
        }
        this.setState({ ...this.state, [loader]: true, errorMessage: null });
        const res = await validateAmount(obj);
        if (res.ok) {
            this.setState({ ...this.state, [loader]: false, errorMessage: null }, () => this.chnageStep(step, values));
        } else {
            this.setState({ ...this.state, [loader]: false, errorMessage: res.data?.message || res.data || res.originalError.message })
        }

    }
    selectItem=(item)=>{
        this.setState({...this.state,currency:item.walletCode},()=>
            {this.chnageStep('newtransfer')}
        )
    }
    renderStep = (step) => {
        const { filterObj, pastPayees, payeesLoading,coinListData,loader } = this.state;
        const steps = {
            currencySelection: <React.Fragment>
                <List
                    itemLayout="horizontal"
                    dataSource={coinListData}
                    className="crypto-list auto-scroll wallet-list c-pointer"
                    loading={loader ? loader : false}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Translate content="No_data" />
                        } />
                    }}
                    renderItem={item => (

                        <List.Item  onClick={() => this.selectItem(item)}>
                            <Link>
                                <List.Item.Meta
                                    avatar={<Image preview={false} src={item.imagePath} />}

                                    title={<div className="wallet-title">{item.walletCode}</div>}
                                />
                                <><div className="text-right coin-typo">
                                    {item.amount !== 0 && <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode=='USD'?'$':'€'} renderText={(value, props) => <div {...props} >{value}</div>} />}
                                 
                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
            </React.Fragment>,
            reviewdetails: <React.Fragment>
                <div ref={this.reviewScrool}></div>
                <div className="mb-16 text-left">
                    <text Paragraph
                        className='fs-24 fw-600 text-white mb-16 mt-4'>Review Details Of Transfer</text>
                </div>
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
                                <Text className="fw-600 text-white px-4 mb-16 mt-4 text-captz" style={{ fontSize: '18px' }}>Transfer details</Text>

                                {/* <div><Link >Edit
                                </Link>
                                </div> */}
                            </div>
                        </Col>
                        {"  "}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">How much you will receive</Title>
                                <Title className="fs-14 text-white fw-500 text-upper text-right">
                                    <NumberFormat
                                        value={`${(this.state.reviewDetails?.requestedAmount - this.state.reviewDetails?.comission)}`}
                                        thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Total fees</Title>
                                <Title className="fs-14 text-white fw-500 text-upper text-right"><NumberFormat
                                    value={`${(this.state.reviewDetails?.comission)}`}
                                    thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Total we will convert</Title>
                                <Title className="fs-14 text-white fw-500 text-upper text-right"></Title>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Withdrawal amount</Title>
                                <Title className="fs-14 text-white fw-500 text-upper text-right"><NumberFormat
                                    value={`${(this.state.reviewDetails?.requestedAmount)}`}
                                    thousandSeparator={true} displayType={"text"} /> {`${this.state.reviewDetails?.walletCode}`}</Title>
                            </div>
                        </Col>
                        {/* <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Description</Title>
                                <Title className="fs-14 text-white fw-500 text-upper text-right">Bike</Title>
                            </div>
                        </Col> */}
                    </Row>

                    <Row gutter={24} className=" text-white mt-36">
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24} >
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Text className="mb-8 fs-14 text-white fw-500 text-upper mt-16">Recipient details</Text>

                                {/* <div><Link >Change
                                </Link>
                                </div> */}
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Save Whitelist name as</Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.favouriteName}</Title>
                            </div>
                        </Col>
                        {this.state.reviewDetails?.name && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Beneficiary Name</Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.name}</Title>
                            </div>
                        </Col>}
                        {this.state.reviewDetails?.firstName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Beneficiary Name</Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.firstName}</Title>
                            </div>
                        </Col>}
                        {this.state.reviewDetails?.lastName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Beneficiary Name</Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.lastName}</Title>
                            </div>
                        </Col>}
                        {this.state.reviewDetails?.iban && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">IBAN </Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.iban}</Title>
                            </div>
                        </Col>}
                        {this.state.reviewDetails?.customerRemarks && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Reason For Transfer </Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state.reviewDetails?.customerRemarks || "-"}</Title>
                            </div>
                        </Col>}
                        {this.state.reviewDetails?.bankName && <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <div className="pay-list py-4" style={{ alignItems: 'baseline' }}>
                                <Title className="fs-14 text-white fw-400 text-captz">Bank Name </Title>
                                <Title className="fs-14 text-white fw-500  text-right">{this.state?.reviewDetails?.bankName || "-"}</Title>
                            </div>
                        </Col>}
                        <Col xs={24} sm={24} md={24} lg={24} xxl={24}>
                            <Verifications onchangeData={(obj) => this.changesVerification(obj)} />
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
                                        style={(this.state.phBtn==true&&this.state.emailBtn==true)||(this.state.phBtn==true&&this.state.authBtn==true)
                                            ||(this.state.authBtn==true&&this.state.emailBtn==true)?"pop-btn px-24":"gray" }
                                        loading={this.state.isBtnLoading} >
                                        Confirm & Continue
                                    </Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>,
            newtransfer: <>
                <FiatAddress currency={this.props.selectedCurrency||this.state.currency} amount={this.state.amount} onContinue={(obj) => {
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
export default ConnectStateProps(AddressBookV2);