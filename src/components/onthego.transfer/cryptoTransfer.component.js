import React, { Component } from "react";
import { Select, Input, Row, Drawer, Col, Form, Button, Typography, List, Divider, Image, Alert, Spin, Empty } from 'antd';
import apicalls from "../../api/apiCalls";
import AddressDocumnet from "../addressbook.component/document.upload";
import oops from '../../assets/images/oops.png';
import FiatAddress from "../addressbook.component/fiat.address";
import alertIcon from '../../assets/images/pending.png';
import success from '../../assets/images/success.png';
import NumberFormat from "react-number-format";
import ConnectStateProps from "../../utils/state.connect";
import {getCoinwithBank, updatePayee, document, saveWithdraw } from "./api";
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
import { handleNewExchangeAPI } from "../send.component/api";
import { validateCryptoAmount } from '../onthego.transfer/api';
import { handleSendFetch, setStep, setSubTitle, setWithdrawcrypto, setAddress,rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import AddressCrypto from "../addressbook.component/addressCrypto";
import SelectCrypto from "../addressbook.component/selectCrypto";
import { processSteps as config } from "../addressbook.component/config";
import CryptoTransfer from '../onthego.transfer/crypto.transfer';
import {fetchPayees, fetchPastPayees,confirmTransaction, validateAmount } from '../onthego.transfer/api';
import { setAddressStep} from "../../reducers/addressBookReducer";

const { Text, Title } = Typography;
const { Option } = Select;
class OnthegoCryptoTransfer extends Component {
    enteramtForm = React.createRef();
    state = {
        step: !this.props.selectedCurrency ? "enteramount" : "selectcurrency",
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
        isVerificationLoading: false,
        addressLu: [],
        filterObj: [],
        loading: false,
        showFuntransfer:false,
        pastPayees: [],
        payeesLoading: true,
        selectedPayee: {},
    }
    componentDidMount() {
        debugger
       // this.verificationCheck()
       this.enteramtForm?.current?.setFieldsValue({amount:this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue});
        this.permissionsInterval = setInterval(this.loadPermissions, 200);
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
        this.getPayees();
    //     if (this.state.selectedCurrency) {
    //         this.getPayees();
    //     }
    //    this.getCoinDetails()
    }

    getPayees= async () => {
        this.setState({ ...this.state, loading: true })
        let response = await apicalls.getPayeeCryptoLu(this.props.userProfile.id, this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
            if (response.ok) {
                this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: response.data, payees: response.data });
            }
            else {
                this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: [] });
            }
       
        let res = await apicalls.getPayeeCrypto(this.props.userProfile.id, this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
            if (res.ok) {
                this.setState({ ...this.state, loading: false, pastPayees: res.data });
            }
            else {
                this.setState({ ...this.state, loading: false,  pastPayees: [] });
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

    handlePreview = (item) => {
        let obj = this.props.sendReceive.withdrawCryptoObj;
        this.props.dispatch(setWithdrawcrypto({ ...obj, toWalletAddress: item.walletAddress, addressBookId: item.id, network: item.network, isShowDeclaration: false }))
        this.props.changeStep('withdraw_crpto_summary');
    }

    closeBuyDrawer = (obj) => {
        let showCrypto = false, showFiat = false;
        if (obj) {
            if (obj.isCrypto)
                showCrypto = !obj?.close;
            else
                showFiat = !obj?.close;
        };
        this.setState({ ...this.state, visible: showCrypto, fiatDrawer: showFiat });

    };

    chnageStep = (step, values) => {
        debugger
        this.props.onTransfer("true");
        this.setState({ ...this.state, step, onTheGoObj: values });
        if (step === 'newtransfer') {
           // this.props.onTransfer("true");
            this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
        }
    }
    amountNext = async (values) => {
        this.setState({ ...this.state, error: null });
        let amt = values.amount;
        amt = typeof amt == "string" ? amt?.replace(/,/g, "") : amt;
        const { withdrawMaxValue, withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (amt === "") {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_amount') });
            this.myRef.current.scrollIntoView();
        }
        else if (amt == 0) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_greater_zero') });
            this.myRef.current.scrollIntoView();
        }
        else if (amt < withdrawMinValue) {
            this.setState({ ...this.state, error: apicalls.convertLocalLang('amount_min') + " " + withdrawMinValue });
            this.myRef.current.scrollIntoView();
        } else if (amt > withdrawMaxValue) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_max') + " " + withdrawMaxValue });
            this.myRef.current.scrollIntoView();
        } else if (amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_less') });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.setState({ ...this.state, amount: amt }, () => this.validateAmt(amt, "newtransfer", values, "newtransferLoader"))
            
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
    // onReviewDetailsLoading = (val) => {
    //     this.setState({ ...this.state, reviewDetailsLoading: val })
    // }
    validateAmt = async (amt, type, values,loader) => {
        this.getPayees();
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.props.dispatch(setSubTitle(""))
         let obj = {
             "customerId": this.props.userProfile.id,
             "customerWalletId": id,
             "walletCode": coin,
             "toWalletAddress": this.state.walletAddress,
             "reference": "",
             "description": "",
             "totalValue": amt,
             "tag": "",
             'amounttype': this.state.amountPercentageType
         }
         this.props.dispatch(setWithdrawcrypto(obj))
         this.props.dispatch(setSubTitle(apicalls.convertLocalLang('wallet_address')));
        const validObj = {
            CustomerId: this.props.userProfile?.id,
            amount: amt ? amt : null,
            WalletCode: this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin
        }
        this.setState({ ...this.state, [loader]: true, errorMessage: null, errorMsg: null });
        const res = await validateCryptoAmount(validObj);
        if (res.ok) {
            this.props.dispatch(setSubTitle(""));
            type == "addressSelection" ?  this.setState({ ...this.state, loading: false, [loader]: false, errorMsg: null }, () => this.props.chnageStep(type,values)): 
            this.setState({
                ...this.state, visible: true, errorWorning: null, errorMsg: null, [loader]: false, showFuntransfer: true
            },() => this.chnageStep(type, values));
        } else {
            this.setState({ ...this.state, loading: false, [loader]: false, errorMsg: this.isErrorDispaly(res) })
            this.myRef.current.scrollIntoView();
        }

    }

    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sendReceive?.cryptoWithdraw?.selectedWallet)
        if (type === 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ ...this.state, USDAmnt: usdamnt, CryptoAmnt: cryptoamnt, amountPercentageType: 'all' });
            this.enteramtForm?.current?.setFieldsValue({amount:obj.coinBalance});
           // this.enteramtForm.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.setState({ ...this.state, CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, amountPercentageType: 'min' });
            this.enteramtForm?.current?.setFieldsValue({amount:this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue});
           // this.enteramtForm.current.changeInfo({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 });
        }
    }

    renderStep = (step) => {
        const { filterObj, pastPayees, payeesLoading, isVarificationLoader, isVerificationEnable,isPhMail,isShowGreyButton,isAuthMail } = this.state;
        const steps = {
            enteramount: <>
            {/* <div className="mb-16" style={{textAlign:'center'}}>
                <text Paragraph
                    className='text-white fs-30 fw-600 px-4 '>Send Fiat</text>
            </div> */}
            {this.state.isVerificationLoading  && <Loader />}
            {!this.state.isVerificationLoading  && 
                    <Form
                        autoComplete="off"
                        initialValues={{ amount: "" }}
                        ref={this.enteramtForm}
                        onFinish={this.amountNext}
                        scrollToFirstError
                    >

                        <Row gutter={[16, 16]} className="align-center send-crypto-err">
                            <Col xs={24} md={24} lg={3} xl={3} xxl={3}>
                                <Title className="fs-30 fw-400 mt-16 text-white-30 text-yellow mr-4 mb-0">
                                    {this.props.selectedWallet?.coin}
                                </Title>
                            </Col>
                            <Col xs={24} md={24} lg={21} xl={21} xxl={21}>
                                <Form.Item
                                    className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label fund-transfer-input send-crypto-input"
                                    name="amount"
                                    //label={"Enter Amount"}                                      
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Is required',
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
                                        decimalScale={8}
                                        displayType="input"
                                        allowNegative={false}
                                        thousandSeparator={","}
                                        addonBefore={this.state.selectedCurrency}
                                        onValueChange={() => {
                                            this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount, errorMessage: '' })
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={24} xxl={24} style={{ marginTop: "-20px" }}>

                                <div class="text-right mr-16">
                                    <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn " onClick={() => this.clickMinamnt("min")}>
                                        <span >Min</span>
                                    </button>
                                    <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn " onClick={() => this.clickMinamnt("all")}>
                                        <span>Max</span>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[16, 4]} className="text-center mt-24 mb-24">
                            <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="mobile-viewbtns">
                                <Form.Item className="text-center">
                                    <Button
                                        htmlType="submit"
                                        size="large"
                                        className="pop-btn mb-36"
                                        style={{ width: '100%' }}
                                        loading={this.state.newtransferLoader}
                                    // disabled={this.state.addressLoader}
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
                                        style={{ width: '100% ' }}
                                        loading={this.state.addressLoader}
                                        disabled={this.state.newtransferLoader}
                                        //onClick={() => this.addressAmtNext()}
                                        onClick={() => {
                                            let _amt = this.enteramtForm.current.getFieldsValue().amount;
                                            _amt = typeof _amt == "string" ? _amt.replace(/,/g, "") : _amt;
                                            if (_amt > 0) {
                                                if (_amt < this.props.selectedWallet?.withdrawMinValue) {
                                                    this.setState({ ...this.state, error: apicalls.convertLocalLang('amount_min') + " " + this.props.selectedWallet?.withdrawMinValue });
                                                    this.myRef.current.scrollIntoView();
                                                } else if (_amt > this.props.selectedWallet?.withdrawMaxValue) {
                                                    this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_max') + " " + this.props.selectedWallet?.withdrawMaxValue });
                                                    this.myRef.current.scrollIntoView();
                                                } else if (_amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
                                                    this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_less') });
                                                    this.myRef.current.scrollIntoView();
                                                }
                                                else {
                                                    this.setState({ ...this.state, isNewTransfer: false, amount: _amt, onTheGoObj: this.enteramtForm.current.getFieldsValue() }, () => {
                                                        this.enteramtForm.current.validateFields().then(() => this.validateAmt(_amt, "addressselection", this.enteramtForm.current.getFieldsValue(), "addressLoader"))
                                                            .catch(error => {

                                                            });
                                                    })
                                                }

                                            } else {
                                                if (!_amt) {
                                                    this.enteramtForm.current.validateFields()
                                                    // this.setState({ ...this.state, errorMessage:'Please enter amount'})
                                                } else {
                                                    // this.validationsCheck(_amt);
                                                    if (_amt === "") {
                                                        this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_amount') });
                                                        this.myRef.current.scrollIntoView();
                                                    }
                                                    else if (this.state.CryptoAmnt == "0" || _amt == 0) {
                                                        this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_greater_zero') });
                                                        this.myRef.current.scrollIntoView();
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        Address Book
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>}
                </>,
                  newtransfer: <>
                  {/* <FiatAddress typeOntheGo={this.props?.ontheGoType} currency={this.state.selectedCurrency} amount={this.state.amount} onContinue={(obj) => {
                      this.setState({ ...this.state, reviewDetails: obj }, () => {
                          this.chnageStep("reviewdetails")
                      })
                  }
                  }
                      onAddressOptionsChange={(value) => this.setState({ ...this.state, addressOptions: value })} onTheGoObj={this.state.onTheGoObj} /> */}
                        <AddressCrypto onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} />
              </>,
               addressselection: <React.Fragment>
                <>
             {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
             {/* <div className="mb-16">
                    <text Paragraph
                        className='fs-26 fw-600 text-white mb-16 mt-4 text-captz text-right'>Send Crypto</text>
                </div> */}
              <div className="mb-16" style={{textAlign:'center'}}>
                    <text Paragraph
                        className='fs-24 fw-600 text-white mb-16 mt-4 text-captz' >Who are you sending crypto to?</text>
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
                    {/* <Text className="fs-14 mb-8 text-white d-block fw-200">
									Search for beneficiary *
								</Text> */}
                                
                    <Search placeholder="Search for beneficiary" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="text-center mt-12" />
                </Col>
                {this.state?.loading && <Loader />}
                {/* {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                  

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            <><Row className="fund-border c-pointer ">
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                        <strong>beneficiary 100
                                        </strong>
                                    </label>
                                    <div><Text className="fs-16 text-white-30 m-0">USD acc ending in 4544</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                                </Col>
                            </Row></>
                    </ul>

                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Past Recipients</Title>
                  
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            <><Row className="fund-border c-pointer ">
                            <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                            <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                    <strong>John's Metamask(0x...)
                                    </strong>
                                </label>
                                <div><Text className="fs-16 text-white-30 m-0">USDT(ERC-20)</Text></div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                            </Col>
                           
                        </Row>
                        <Row className="fund-border c-pointer ">
                        <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                            <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                    <strong>Smith Metamask(3b...)
                                    </strong>
                                </label>
                                <div><Text className="fs-16 text-white-30 m-0">USDT(ERC-20)</Text></div>
                            </Col>
                            <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                <span class="icon md rarrow-white" onClick={() => this.handlePreview()}></span>
                            </Col>
                            </Row></>
                      
                    </ul>
                </>} */}

                {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                    <Divider className="cust-divide" />

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(filterObj.length > 0) && filterObj?.map((item, idx) =>
                            <>{<Row className="fund-border c-pointer " onClick={async () => {
                                if (!["myself", "1stparty", 'ownbusiness'].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } }, () => {this.handlePreview(item)});
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } });
                                    const res = await apicalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (!res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => {this.handlePreview(item)});
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz">{item?.name} ({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                                    {/* {item.accountNumber && <div><Text className="fs-14 text-white-30 m-0">{this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin} account ending with {item.accountNumber?.substr(item.accountNumber.length - 4)}</Text></div>} */}
                                    {item.walletAddress && <div><Text className="fs-14 text-white-30 m-0">{item.walletCode} ({item.network})</Text></div>}
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
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
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item }, () => {this.handlePreview(item)})
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                                    const res = await apicalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    if (res.ok) {
                                        this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => {this.handlePreview(item)});
                                    } else {
                                        this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    }
                                }
                            }}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="fs-16 fw-600 text-white l-height-normal text-captz">{item?.name}({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                                    <div><Text className="fs-14 text-white-30 m-0">{item?.walletCode} ({item.network})</Text></div>
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
                        </div>}
                    </ul>
                </>}
                
                {/* <Drawer
                        destroyOnClose={true}
                        title={[
                            <div className="side-drawer-header">
                                {this.renderTitle()}
                                <div className="text-center fs-16">
                                    <Translate
                                        className="text-white-30 fw-600 text-upper mb-4"
                                        content={
                                            this.props.addressBookReducer.stepTitles[
                                            config[this.props.addressBookReducer.stepcode]
                                            ]
                                        }
                                        component={Paragraph}
                                    />
                                    <Translate
                                        className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte"
                                        content={
                                            this.props.addressBookReducer.stepSubTitles[
                                            config[this.props.addressBookReducer.stepcode]
                                            ]
                                        }
                                        component={Paragraph}
                                    />
                                </div>
                                {this.renderIcon()}
                            </div>,
                        ]}
                        placement="right"
                        closable={true}
                        visible={this.state.visible}
                        closeIcon={null}
                        className="side-drawer w-50p">
                        {this.renderContent()}
                    </Drawer> */}
             </>  
               </React.Fragment>
        }
        return steps[this.state.step];
    }
    render() {
        return <React.Fragment>
            {this.renderStep()}
        </React.Fragment>
    }

    // renderContent = () => {
    //     const stepcodes = {
    //         cryptoaddressbook: (<>
    //             {/* <NewAddressBook onCancel={() => this.closeBuyDrawer()} /> */}
    //             <AddressCrypto onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} />
    //         </>
    //         ),
    //         selectcrypto: <SelectCrypto />,
    //     };
    //     return stepcodes[config[this.props.addressBookReducer.stepcode]];
    // };
    // renderIcon = () => {
    //     const stepcodes = {
    //         cryptoaddressbook: (
    //             <span
    //                 onClick={() => this.closeBuyDrawer()}
    //                 className="icon md close-white c-pointer"
    //             />
    //         ),
    //         selectcrypto: <span />,
    //     };
    //     return stepcodes[config[this.props.addressBookReducer.stepcode]];
    // };

    // renderTitle = () => {
    //     const titles = {
    //         cryptoaddressbook: <span />,
    //         selectcrypto: (
    //             <span
    //                 onClick={this.backStep}
    //                 className="icon md lftarw-white c-pointer"
    //             />
    //         ),
    //     };
    //     return titles[config[this.props.addressBookReducer.stepcode]];
    // };

    // render() {
    //     const { Text } = Typography;


    //     return (
    //         <div>
               
    //                 <Form
    //                     autoComplete="off"
    //                     initialValues={{ amount: "" }}
    //                     ref={this.enteramtForm}
    //                     onFinish={this.amountNext}
    //                     scrollToFirstError
    //                 >

    //                     <Row gutter={[16, 16]} className="align-center send-crypto-err">
    //                         <Col xs={24} md={24} lg={3} xl={3} xxl={3}>
    //                             <Title className="fs-30 fw-400 mt-16 text-white-30 text-yellow mr-4 mb-0">
    //                                 {this.props?.selectedWallet?.coin}
    //                             </Title>
    //                         </Col>
    //                         <Col xs={24} md={24} lg={21} xl={21} xxl={21}>
    //                             <Form.Item
    //                                 className="fw-300 mb-8 px-4 text-white-50 pt-16 custom-forminput custom-label fund-transfer-input send-crypto-input"
    //                                 name="amount"
    //                                 //label={"Enter Amount"}                                      
    //                                 required
    //                                 rules={[
    //                                     {
    //                                         required: true,
    //                                         message: 'Is required',
    //                                     },
    //                                     {
    //                                         validator: (_, value) => {
    //                                             const reg = /.*[0-9].*/g;
    //                                             if (value && !reg.test(value)) {
    //                                                 return Promise.reject("Invalid amount");
    //                                             }
    //                                             return Promise.resolve();
    //                                         }
    //                                     }
    //                                 ]}
    //                             >
    //                                 <NumberFormat
    //                                     customInput={Input}
    //                                     className="cust-input"
    //                                     placeholder={"Enter Amount"}
    //                                     maxLength="13"
    //                                     decimalScale={8}
    //                                     displayType="input"
    //                                     allowNegative={false}
    //                                     thousandSeparator={","}
    //                                     addonBefore={this.state.selectedCurrency}
    //                                     onValueChange={() => {
    //                                         this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount, errorMessage: '' })
    //                                     }}
    //                                 />
    //                             </Form.Item>
    //                         </Col>
    //                         <Col xs={24} md={24} lg={24} xl={24} xxl={24} style={{ marginTop: "-20px" }}>

    //                             <div class="text-right mr-16">
    //                                 <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn " onClick={() => this.clickMinamnt("min")}>
    //                                     <span >Min</span>
    //                                 </button>
    //                                 <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn " onClick={() => this.clickMinamnt("all")}>
    //                                     <span>Max</span>
    //                                 </button>
    //                             </div>
    //                         </Col>
    //                     </Row>
    //                     <Row gutter={[16, 4]} className="text-center mt-24 mb-24">
    //                         <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="mobile-viewbtns">
    //                             <Form.Item className="text-center">
    //                                 <Button
    //                                     htmlType="submit"
    //                                     size="large"
    //                                     className="pop-btn mb-36"
    //                                     style={{ width: '100%' }}
    //                                     loading={this.state.newtransferLoader}
    //                                 // disabled={this.state.addressLoader}
    //                                 >
    //                                     New Transfer
    //                                 </Button>
    //                             </Form.Item>
    //                         </Col>
    //                         <Col xs={24} md={12} lg={12} xl={12} xxl={12} className="mobile-viewbtns">
    //                             <Form.Item className="text-center">
    //                                 <Button
    //                                     htmlType="button"
    //                                     size="large"
    //                                     className="pop-btn mb-36"
    //                                     style={{ width: '100% ' }}
    //                                     loading={this.state.addressLoader}
    //                                     disabled={this.state.newtransferLoader}
    //                                     //onClick={() => this.addressAmtNext()}
    //                                     onClick={() => {
    //                                         let _amt = this.enteramtForm.current.getFieldsValue().amount;
    //                                         _amt = typeof _amt == "string" ? _amt.replace(/,/g, "") : _amt;
    //                                         if (_amt > 0) {
    //                                             if (_amt < this.props?.selectedWallet?.withdrawMinValue) {
    //                                                 this.setState({ ...this.state, error: apicalls.convertLocalLang('amount_min') + " " + this.props?.selectedWallet?.withdrawMinValue });
    //                                                 this.myRef.current.scrollIntoView();
    //                                             } else if (_amt > this.props?.selectedWallet?.withdrawMaxValue) {
    //                                                 this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_max') + " " + this.props?.selectedWallet?.withdrawMaxValue });
    //                                                 this.myRef.current.scrollIntoView();
    //                                             } else if (_amt > this.props.sendReceive?.cryptoWithdraw?.this.props?.selectedWallet?.coinBalance) {
    //                                                 this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_less') });
    //                                                 this.myRef.current.scrollIntoView();
    //                                             }
    //                                             else {
    //                                                 this.setState({ ...this.state, isNewTransfer: false, amount: _amt, onTheGoObj: this.enteramtForm.current.getFieldsValue() }, () => {
    //                                                     this.enteramtForm.current.validateFields().then(() => this.validateAmt(_amt, "addressSelection", this.enteramtForm.current.getFieldsValue(), "addressLoader"))
    //                                                         .catch(error => {

    //                                                         });
    //                                                 })
    //                                             }

    //                                         } else {
    //                                             if (!_amt) {
    //                                                 this.enteramtForm.current.validateFields()
    //                                                 // this.setState({ ...this.state, errorMessage:'Please enter amount'})
    //                                             } else {
    //                                                 // this.validationsCheck(_amt);
    //                                                 if (_amt === "") {
    //                                                     this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_amount') });
    //                                                     this.myRef.current.scrollIntoView();
    //                                                 }
    //                                                 else if (_amt == 0) {
    //                                                     this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_greater_zero') });
    //                                                     this.myRef.current.scrollIntoView();
    //                                                 }
    //                                             }
    //                                         }
    //                                     }}
    //                                 >
    //                                     Address Book
    //                                 </Button>
    //                             </Form.Item>
    //                         </Col>
    //                     </Row>
    //                 </Form>

    //                 <Drawer
    //                     destroyOnClose={true}
    //                     title={[
    //                         <div className="side-drawer-header">
    //                             {this.renderTitle()}
    //                             <div className="text-center fs-16">
    //                                 <Translate
    //                                     className="text-white-30 fw-600 text-upper mb-4"
    //                                     content={
    //                                         this.props.addressBookReducer.stepTitles[
    //                                         config[this.props.addressBookReducer.stepcode]
    //                                         ]
    //                                     }
    //                                     component={Paragraph}
    //                                 />
    //                                 <Translate
    //                                     className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte"
    //                                     content={
    //                                         this.props.addressBookReducer.stepSubTitles[
    //                                         config[this.props.addressBookReducer.stepcode]
    //                                         ]
    //                                     }
    //                                     component={Paragraph}
    //                                 />
    //                             </div>
    //                             {this.renderIcon()}
    //                         </div>,
    //                     ]}
    //                     placement="right"
    //                     closable={true}
    //                     visible={this.state.visible}
    //                     closeIcon={null}
    //                     className="side-drawer w-50p">
    //                     {this.renderContent()}
    //                 </Drawer>
                
    //         </div>
    //     )

    // }


}

const connectStateToProps = ({ sendReceive, userConfig, menuItems, oidc }) => {
    return {
        sendReceive,
        userProfile: userConfig?.userProfileInfo,
        trackAuditLogData: userConfig?.trackAuditLogData,
        withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,
        oidc: oidc?.user?.profile
    };
};
const connectDispatchToProps = dispatch => {
    return {
        changeInternalStep: (stepcode) => {
            // dispatch(setInternalStep(stepcode))
        },
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        clearAddress: (stepcode) => {
            dispatch(setAddress(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(OnthegoCryptoTransfer));