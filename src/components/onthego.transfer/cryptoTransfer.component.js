import React, { Component } from "react";
import { Input, Row, Col, Form, Button, Typography, Alert,Tabs,Radio} from 'antd';
import apicalls from "../../api/apiCalls";
import oops from '../../assets/images/oops.png';
import NumberFormat from "react-number-format";
import Loader from "../../Shared/loader";
import Search from "antd/lib/input/Search";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { fetchMemberWallets } from "../dashboard.component/api";
import { connect } from "react-redux";
import { validateCryptoAmount } from '../onthego.transfer/api';
import { setStep, setSubTitle, setWithdrawcrypto, setAddress, hideSendCrypto,rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import AddressCrypto from "../addressbook.component/addressCrypto";
import Currency from '../shared/number.formate';
import { setAddressStep } from "../../reducers/addressBookReducer";
import Translate from 'react-translate-component';

const { Text } = Typography;

class OnthegoCryptoTransfer extends Component {
    enteramtForm = React.createRef();
    myRef = React.createRef();
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
        loading: false,
        showFuntransfer: false,
    }
    componentDidMount() {
        this.enteramtForm?.current?.setFieldsValue({ amount: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue });
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
    }

    getPayees = async () => {
        this.setState({ ...this.state, loading: true })
        let response = await apicalls.getPayeeCryptoLu(this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
        if (response.ok) {
            this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: response.data, payees: response.data ,errorMessage:null});
        }
        else {
            this.setState({ ...this.state, loading: false, payeesLoading: false, filterObj: [],errorMessage:apicalls.isErrorDispaly(response) });
        }

        let res = await apicalls.getPayeeCrypto(this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin);
        if (res.ok) {
            this.setState({ ...this.state, loading: false, pastPayees: res.data,errorMessage:null });
        }
        else {
            this.setState({ ...this.state, loading: false, pastPayees: [] ,errorMessage:apicalls.isErrorDispaly(response)});
        }
    }
    handleSearch = ({ target: { value: val } }) => {
        if (val) {
            const filterObj = this.state.payees.filter(item => item.name.toLowerCase().includes(val.toLowerCase()));
            this.setState({ ...this.state, filterObj, searchVal: val });
        }
        else
       {this.setState({ ...this.state, filterObj: this.state.payees, searchVal: val })}
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
        }
        this.setState({ ...this.state, visible: showCrypto, fiatDrawer: showFiat });
        this.props.dispatch(setAddressStep("step1"));
    };

    chnageStep = (step, values) => {
        this.props.onTransfer("true");
        this.props.dispatch(hideSendCrypto(false));
        this.setState({ ...this.state, step, onTheGoObj: values });
        if (step === 'newtransfer') {
            this.props.dispatch(hideSendCrypto(true));
            this.setState({ ...this.state, step, isNewTransfer: true, onTheGoObj: values });
        } else {
            this.props.dispatch(rejectWithdrawfiat())
        }
    }
    amountNext = async (values) => {
        this.setState({ ...this.state, error: null });
        let amt = values.amount;
        amt = typeof amt == "string" ? amt?.replace(/,/g, "") : amt;
        const {  withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (amt === "") {
            this.setState({ ...this.state, errorMsg: null, error: " " + apicalls.convertLocalLang('enter_amount') });
            this.myRef.current.scrollIntoView();
        }
        else if (parseFloat(amt) === 0) {
            this.setState({ ...this.state, errorMsg: null, error: " " + apicalls.convertLocalLang('amount_greater_zero') });
            this.myRef.current.scrollIntoView();
        }
        else if (parseFloat(amt) < withdrawMinValue) {
            this.setState({ ...this.state, errorMsg: null, error: apicalls.convertLocalLang('amount_min') + " " + withdrawMinValue });
            this.myRef.current.scrollIntoView();
        }
       
        else if (parseFloat(amt) > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
            this.setState({ ...this.state, errorMsg: null, error: " " + apicalls.convertLocalLang('insufficient_balance') });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.setState({ ...this.state, amount: amt }, () => this.validateAmt(amt, "newtransfer", values, "newtransferLoader"))
            
        } 
    } 
  
  
    validateAmt = async (amt, type, values, loader) => {
        this.getPayees();
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.props.dispatch(setSubTitle(""))
        this.props.dispatch(hideSendCrypto(false));
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
            type === "addressSelection" ? this.setState({ ...this.state, loading: false, [loader]: false, errorMsg: null }, () => this.props.chnageStep(type, values)) : 
            this.setState({
                ...this.state, visible: true, errorWorning: null, errorMsg: null, [loader]: false, showFuntransfer: true
            }, () => this.chnageStep(type, values));
        } else {
            this.setState({ ...this.state, loading: false, [loader]: false, error: null, errorMsg: apicalls.isErrorDispaly(res) })
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
            this.enteramtForm?.current?.setFieldsValue({ amount: obj.coinBalance });
        } else {
            this.setState({ ...this.state, CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, amountPercentageType: 'min' });
            this.enteramtForm?.current?.setFieldsValue({ amount: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue });
        }
    }
    numberValidator = async function (rule, value, callback) {
        if (value) {
            if (typeof value === "number") {
                value = value.toString();
            }
            const reg = /.*[0-9].*/g;
            if (value && !reg.test(value)) {
                throw new Error("Invalid amount");
            }
            else if (
                (value.indexOf(".") > -1 && value.split(".")[0].length >= 11) ||
                (value.indexOf(".") < 0 && value.length >= 11)
            ) {
                throw new Error("Amount exceeded");
            }
            else {
                callback();
            }
        }
        else if (value === 0 && typeof value === "number") {
            callback();
        }
        else if (!value) {
            throw new Error("Is required");
        }
    };


    keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.goToAddressBook()
        }
    }
    submitHandler = (e) => {
        e.preventDefault()
    }

    goToAddressBook = () => {
        let _amt = this.enteramtForm.current.getFieldsValue().amount
        _amt = typeof _amt == 'string' ? _amt.replace(/,/g, '') : _amt

        this.setState({ ...this.state, errorMsg: null, error: null })
        if (_amt > 0) {
            if (_amt < this.props.selectedWallet?.withdrawMinValue) {
                this.setState({
                    ...this.state,
                    errorMsg: null,
                    error:
                        apicalls.convertLocalLang('amount_min') +
                        ' ' +
                        this.props.selectedWallet?.withdrawMinValue,
                })
                this.myRef.current.scrollIntoView()
            }
            else if (
                _amt >
                this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance
            ) {
                this.setState({
                    ...this.state,
                    errorMsg: null,
                    error: ' ' + apicalls.convertLocalLang('insufficient_balance'),
                })
                this.myRef.current.scrollIntoView()
            } else {
                this.setState(
                    {
                        ...this.state,
                        isNewTransfer: false,
                        amount: _amt,
                        onTheGoObj: this.enteramtForm.current.getFieldsValue(),
                    },
                    () => {
                        this.enteramtForm.current
                            .validateFields()
                            .then(() =>
                                this.validateAmt(
                                    _amt,
                                    'addressselection',
                                    this.enteramtForm.current.getFieldsValue(),
                                    'addressLoader',
                                ),
                            )
                    },
                )
            }
        } else {
            if (!_amt && _amt != 0) {
                this.enteramtForm.current.validateFields()
            } else {
                if ((this.state.CryptoAmnt == '0' || _amt == 0)) {
                    this.setState({
                        ...this.state,
                        errorMsg: null,
                        error: ' ' + apicalls.convertLocalLang('amount_greater_zero'),
                    })
                    this.myRef.current.scrollIntoView()
                }
            }
        }
    }
    handleTabChange = (key) => {
        this.setState({ ...this.state, selectedTab: key})
    }

    renderStep = (step) => {
        const { filterObj, pastPayees } = this.state;
        const steps = {
        enteramount: (
            <>
            {this.state.isVerificationLoading && <Loader />}
            {!this.state.isVerificationLoading &&
                <Form
                autoComplete="off"
                initialValues={{ amount: "" }}
                ref={this.enteramtForm}
                onFinish={this.amountNext}
                scrollToFirstError
                onSubmit={this.submitHandler}
                >
                <div ref={this.myRef}></div>
                {this.state.error != null && <Alert type="error"
                        description={this.state.error} onClose={() => this.setState({ ...this.state, error: null })} showIcon />}
                {this.state.errorMsg && (
                    <Alert
                    className="mb-12"
                    showIcon
                    description={this.state.errorMsg}
                    closable={false}
                    type="error"
                    />
                )}
                <Row gutter={[16, 16]} className="align-center send-crypto-err mx-4">

            

                <div className="enter-val-container swap-com swap-text-sub new-swap-subtext  send-crypto-enrty send-crypto-mobile">
                  <div className='swap-entryvalue send-crypto-style'>    <Form.Item
                  className="custom-forminput custom-label fund-transfer-input send-crypto-input crypto-blc-inpt " 
                  name="amount"
                  required
                  rules={[
                    {
                      type: "number",
                      validator: this.numberValidator
                    },
                  ]}
                >
                 <NumberFormat
                    customInput={Input}
                    className="inputfont-style  inputbg-fonts swap-text-sub"
                    placeholder={"Enter Amount"}
                    maxLength="20"
                    bordered={false}
                    decimalScale={8}
                    autoComplete="off"
                    displayType="input"
                    allowNegative={false}
                    thousandSeparator={true}
                    onKeyDown={this.keyDownHandler}
                    addonBefore={this.state.selectedCurrency}
                    // suffix={this.props.selectedWallet?.coin}
                    onValueChange={() => {
                        this.setState({ ...this.state, amount: this.enteramtForm.current?.getFieldsValue().amount, errorMessage: null,error: null })
                    }}
                  />

                  

                </Form.Item></div>
                <div className='swapcoin-alignemnt crypto-coin-mbspace coin-name-mb'><span>{this.props.selectedWallet?.coin}</span></div>
</div>
              </Row>
              <div className="display-items moblie-order">
              <div class="text-center mr-16">
                                <Radio.Group defaultValue='min' buttonStyle="solid" className="round-pills sell-radiobtn-style text-left send-minmax" onChange={({ target: { value } }) => {
                                    this.clickMinamnt(value)
                                }}>
                                    <Translate value="min" content="min" component={Radio.Button} />
                                    
                                    <Translate value="all" content="all" component={Radio.Button} />
                                </Radio.Group>
        </div>
                            
                  <div className='crypto-details'><div className='sellcrypto-style'>Balance:</div> <Currency defaultValue={this.props?.selectedWallet?.coinBalance} prefix={""} type={"text"} suffixText={this.props?.selectedWallet?.coin} className="marginL sellbal-style" /></div>
                  </div>
              <Row gutter={[16,0]} className="text-center transfer-designstyle">
              <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mobile-viewbtns mobile-btn-pd">
                  <Form.Item className="">
                    <Button
                      htmlType="submit"
                      size="large"
                      className="newtransfer-card text-left"
                      loading={this.state.newtransferLoader}
                    >
                      New Transfer
                    </Button>
                  </Form.Item>
                </Col>
                <Col xs={24} md={24} lg={24} xl={24} xxl={24} className="mobile-viewbtns mobile-btn-pd">
                  <Form.Item className="">
                    <Button
                      htmlType="button"
                      size="large"
                      className="newtransfer-card text-left"
                      loading={this.state.addressLoader}
                      disabled={this.state.newtransferLoader}
                      onClick={this.goToAddressBook}
                    >
                      Address Book
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          }
        </>
      ),
      newtransfer: (
        <>
          <AddressCrypto onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} isShowheading= {true} />
        </>
      ),
      addressselection: (<React.Fragment>
          <>
          {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
          <div>
                    <text Paragraph
                        className='label-style' >Who are you sending crypto to?</text>
                </div>
           {this.state.selectedTab != 2 && <Col xs={24} md={24} lg={24} xl={24} xxl={24}  className="search-space">
            <Search placeholder="Search For Beneficiary" value={this.state.searchVal} prefix={<span className="icon lg search-angle drawer-search" />} onChange={this.handleSearch} size="middle" bordered={false} className="cust-search" />
            </Col>}
            {this.state?.loading && <Loader />}
            {(!this.state.loading) && <>
                <div className="addressbook-grid">
					<Tabs className="cust-tabs-fait" 
							  activeKey={this.selectedTab}
                              onChange={this.handleTabChange}>					
                                <Tabs.TabPane tab="Address Book" content="withdrawCrypto" key={1} className=""  component={Radio}>
                <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList mobile-scroll adbook-scroll">
                {(filterObj.length > 0) && filterObj?.map((item, idx) =>
                            <>{<Row className="fund-border c-pointer " onClick={async () => {
                                if (!["myself", "1stparty", 'ownbusiness'].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } }, () => {this.handlePreview(item)});
                              } else {
                                this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item, codeDetails: { ...this.state.codeDetails, ...item } });
                                const res = await apicalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                if (!res.ok) {
                                    this.setState({ ...this.state, reviewDetails: res.data, loading: false ,errorMessage:null}, () => {this.handlePreview(item)});
                                } else {
                                    this.setState({ ...this.state, loading: false, errorMessage: apicalls.isErrorDispaly(res) });
                                }
                              }
                            }}>
                           <Col xs={4} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                           <Col xs={19} md={22} lg={22} xl={19} xxl={19} className="small-text-align adbook-mobile">
                           <label className="address-name">{item?.name} ({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                           {item.walletAddress && <div><Text className="address-subtext">{item.walletCode} ({item.network})</Text></div>}
                            </Col>
                            </Row>}</>
                    )}
                  {(!filterObj.length > 0) && <div className="success-pop text-center declaration-content">
                            <img src={oops} className="confirm-icon nodata-image" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="success-title oops-title" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="successsubtext custom-height"> {apicalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.chnageStep("newtransfer")} className="nodata-text">Click here to make new transfer</a>
                        </div>}
                </ul>
              </Tabs.TabPane>
                                <Tabs.TabPane tab="Past Recipients" content="withdrawFiat" key={2} className="" component={Radio}> 
                <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList paste-recept-style mobile-scroll adbook-scroll">
                {(pastPayees.length > 0) && pastPayees?.map((item, idx) =>
                     <Row className="fund-border c-pointer" onClick={async () => {
                        if (!["myself", "1stparty", "ownbusiness"].includes(item.addressType?.toLowerCase())) {
                            this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item }, () => {this.handlePreview(item)})
                          } else {
                            this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                            const res = await apicalls.confirmCryptoTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                            if (res.ok) {
                                this.setState({ ...this.state, reviewDetails: res.data, loading: false,errorMessage:null }, () => {this.handlePreview(item)});
                            } else {
                                this.setState({ ...this.state, loading: false, errorMessage: apicalls.isErrorDispaly(res) });
                            }
                          }
                        }}>
                        <Col xs={3} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name?.charAt(0).toUpperCase()}</div></Col>
                        <Col xs={19} md={24} lg={24} xl={19} xxl={19} className=" small-text-align adbook-mobile past-respnt">
                        <label className="address-name">{item?.name} ({item.walletAddress?.length > 0 ? item.walletAddress.substring(0,4)+ `......`+ item.walletAddress.slice(-4):""})</label>
                        <div><Text className="address-subtext">{item?.walletCode} ({item.network})</Text></div>
                        </Col>
                       
                      </Row>

                    )}
                  {(!pastPayees.length > 0) && <div className="success-pop text-center declaration-content">
                            <img src={oops} className="confirm-icon nodata-image" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="success-title oops-title" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="successsubtext custom-height"> {'You have no past recipients'} </p>
                        </div>}
                </ul> </Tabs.TabPane>
						    </Tabs>
							</div>
              </>}
          </>
        </React.Fragment>
      ),
    }
    return steps[this.state.step];
  }
  render() {
    return <React.Fragment>
        {this.renderStep()}
    </React.Fragment>
}

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