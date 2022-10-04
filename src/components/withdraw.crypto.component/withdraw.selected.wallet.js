import React, { Component } from 'react';
import { Typography, Button, Drawer, Card, Input, Radio, Alert, Row, Col, Form, Modal, Tooltip, Image } from 'antd';
import { handleSendFetch, setStep, setSubTitle, setWithdrawcrypto, setAddress,rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import {
    setAddressStep
} from "../../reducers/addressBookReducer";
import Translate from 'react-translate-component';
import Currency from '../shared/number.formate';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import SuccessMsg from './success';
import apicalls from '../../api/apiCalls';
import { validateContent, validateContentRule } from '../../utils/custom.validator';
import { processSteps as config } from "../addressbook.component/config";
import AddressCrypto from "../addressbook.component/addressCrypto";
import SelectCrypto from "../addressbook.component/selectCrypto";
import apiCalls from "../../api/apiCalls";
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../../Shared/loader';
import CryptoTransfer from "../onthego.transfer/crypto.transfer"
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService';
import { handleNewExchangeAPI } from "../send.component/api";
import { validateCryptoAmount } from '../onthego.transfer/api';
import NumberFormat from "react-number-format";

const { Paragraph, Text,Title } = Typography;

class CryptoWithDrawWallet extends Component {
    enteramtForm = React.createRef();
    eleRef = React.createRef();
    myRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue,
            USDAmnt: "",
            isSwap: true,
            error: null,
            walletAddress: null,
            loading: false,
            showModal: false,
            confirmationStep: "step1",
            isWithdrawSuccess: false,
            amountPercentageType: "min",
            customerRemarks: null,
            fiatDrawer: false,
            visible: false,
            cryptoFiat: false,
            isVerificationMethodsChecked: true,
            propsData: {},
            isVerificationLoading: true,
            showFuntransfer: false,
            errorMsg: null,
            newtransferLoader: false,
            addressLoader: false
        }
    }
    async checkVerification() {
        const verfResponse = await apiCalls.getVerificationFields(this.props.userProfile.id);
        let minVerifications = 0;
        if (verfResponse.ok) {
            for (let verifMethod in verfResponse.data) {
                if (["isEmailVerification", "isPhoneVerified", "twoFactorEnabled", "isLiveVerification"].includes(verifMethod) && verfResponse.data[verifMethod] == true) {
                    minVerifications = minVerifications + 1;
                }
            }
        }
        this.setState({ ...this.state, isVerificationLoading: false });
        return minVerifications >= 2;
    }
    async componentDidMount() {
        const isVerified = await this.checkVerification();
        if (isVerified) {
            if (this.props.sendReceive.withdrawCryptoObj) {
                this.enteramtForm.current?.handleConvertion({ cryptoValue: this.props.sendReceive?.withdrawCryptoObj?.totalValue, localValue: 0 })
                this.setState({ ...this.state, walletAddress: this.props.sendReceive.withdrawCryptoObj.toWalletAddress, amountPercentageType: this.props.sendReceive.withdrawCryptoObj.amounttype });
            } else {
                //this.enteramtForm.current?.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
            }
            this.enteramtForm?.current?.setFieldsValue({amount:this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue});
            this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 2 }))
            this.props.dispatch(setSubTitle(apicalls.convertLocalLang('wallet_address')));
        }
        else {
            this.setState({ ...this.state, isVerificationMethodsChecked: isVerified });
        }
        getFeaturePermissionsByKeyName(`sendreceivecrypto`)
        this.trackevent();
    }
    trackevent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Withdraw Crypto Selected page view', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto Selected page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
        });
    }
    componentWillUnmount() {
        this.setState({ ...this.state, isWithdrawSuccess: false });
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
        this.props.dispatch(rejectWithdrawfiat())
    };
    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: (<>
                {/* <NewAddressBook onCancel={() => this.closeBuyDrawer()} /> */}
                <AddressCrypto onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} />
            </>
            ),
            selectcrypto: <SelectCrypto />,
        };
        return stepcodes[config[this.props.addressBookReducer.stepcode]];
    };
    renderIcon = () => {
        const stepcodes = {
            cryptoaddressbook: (
                <span
                    onClick={() => this.closeBuyDrawer()}
                    className="icon md close-white c-pointer"
                />
            ),
            selectcrypto: <span />,
        };
        return stepcodes[config[this.props.addressBookReducer.stepcode]];
    };

    renderTitle = () => {
        const titles = {
            cryptoaddressbook: <span />,
            selectcrypto: (
                <span
                    onClick={this.backStep}
                    className="icon md lftarw-white c-pointer"
                />
            ),
        };
        return titles[config[this.props.addressBookReducer.stepcode]];
    };
    selectCrypto = async (type,buttonLoader) => {
        debugger
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
       this.props.dispatch(setSubTitle(""))
        let obj = {
            "customerId": this.props.userProfile.id,
            "customerWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": "",
            'amounttype': this.state.amountPercentageType
        }
        this.props.dispatch(setWithdrawcrypto(obj))
        this.props.dispatch(setSubTitle(apicalls.convertLocalLang('wallet_address')));
        this.setState({ ...this.state, loading: true, newtransferLoader: true  })
        if (type == "ADDRESS") {
            this.props.changeStep('step8');
            this.props.dispatch(setSubTitle(""))
        }
        else {
            this.amountNext(type,buttonLoader);
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
        else if (this.state.CryptoAmnt === "0" || amt == 0) {
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


        validateAmt = async (amt, type, values,loader) => {
            const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
            this.props.dispatch(setSubTitle(""))
             let obj = {
                 "customerId": this.props.userProfile.id,
                 "customerWalletId": id,
                 "walletCode": coin,
                 "toWalletAddress": this.state.walletAddress,
                 "reference": "",
                 "description": "",
                 "totalValue": amt || this.state.CryptoAmnt,
                 "tag": "",
                 'amounttype': this.state.amountPercentageType
             }
             this.props.dispatch(setWithdrawcrypto(obj))
             this.props.dispatch(setSubTitle(apicalls.convertLocalLang('wallet_address')));
            const validObj = {
                CustomerId: this.props.userProfile?.id,
                amount: amt ? amt : this.state.CryptoAmnt ? this.state.CryptoAmnt : null,
                WalletCode: this.props?.sendReceive?.cryptoWithdraw?.selectedWallet?.coin
            }
            this.setState({ ...this.state, [loader]: true, errorMessage: null, errorMsg: null });
            const res = await validateCryptoAmount(validObj);
            if (res.ok) {
                this.props.dispatch(setSubTitle(""));
                type == "addressSelection" ?  this.setState({ ...this.state, loading: false, [loader]: false, errorMsg: null }, () => this.props.changeStep('step10')): 
                this.setState({
                    ...this.state, visible: true, errorWorning: null, errorMsg: null, [loader]: false, showFuntransfer: true
                });
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
    handlePreview = () => {
        const amt = parseFloat(this.state.CryptoAmnt);
        const { withdrawMaxValue, withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (this.state.CryptoAmnt === "") {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_amount') });
            this.myRef.current.scrollIntoView();
        }
        else if (this.state.CryptoAmnt === "0" || amt === 0) {
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
        } else if (!validateContent(this.state.walletAddress)) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('please_enter_valid_content') });
            this.myRef.current.scrollIntoView();
        }
        else if (this.state.walletAddress == null || this.state.walletAddress.trim() === "") {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_wallet_address') });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.withDraw();
        }
    }
    handleRemarkChange = (event) => {
        let data = event.target.value;
        this.setState({ ...this.state, customerRemarks: data })
    }
    withDraw = async () => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null, loading: true, isWithdrawSuccess: false });
        let obj = {
            "customerId": this.props.userProfile.id,
            "MemberWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": "",
            "amounttype": this.state.amountPercentageType,
            "CustomerRemarks": this.state.customerRemarks
        }
        const response = await handleNewExchangeAPI({
            customerId: this.props?.userProfile?.id,
            amount: obj.totalValue,
            address: obj.toWalletAddress,
            coin: obj.walletCode,
        });
        if (response.ok) {
            this.props.dispatch(setWithdrawcrypto(obj))
            this.props.changeStep('withdraw_crpto_summary');
        } else {
            this.setState({ ...this.state, loading: false, errorMsg: this.isErrorDispaly(response) });
            this.myRef.current.scrollIntoView()
        }
        //this.props.dispatch(setSubTitle(apicalls.convertLocalLang('withdrawSummary')));

    }
    isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
            return objValue.data;
        } else if (objValue.originalError && typeof objValue.originalError.message === "string"
        ) {
            return objValue.originalError.message;
        } else {
            return "Something went wrong please try again!";
        }
    };
    renderModalContent = () => {
        if (!this.props?.sendReceive?.cryptoWithdraw?.selectedWallet) { return null }
        const { walletAddress, CryptoAmnt, confirmationStep } = this.state;
        const { coin, netWork } = this.props?.sendReceive?.cryptoWithdraw?.selectedWallet
        const _types = {
            step1: <p className="text-center"><b>{netWork}</b> selected as the transfer network. few platforms support the {netWork}.Please confirm that the receving platform supports this network </p>,
            step2: <div>
                <p> <Currency defaultValue={CryptoAmnt} prefixText={<b>Amount: </b>} prefix={""} suffixText={coin} /></p>
                <p><b>Address: </b> {walletAddress}</p>
                <p><b>Network: </b> {netWork}</p>
                <ul>
                    <li>Ensure that the address is correct and on the same network</li>
                    <li>Transaction can't be cancelled</li>
                </ul>
            </div>,
            step3: <div>
                <p> <Currency defaultValue={CryptoAmnt} prefixText={<b>Amount: </b>} prefix={""} suffixText={coin} /></p>
                <p><b>Address: </b> {walletAddress}</p>
                <p><b>Network: </b> {netWork}</p>
                <Form name="verification" initialValues={{ Phone: "" }}>
                    <Form.Item label="Phone" extra="Please enter 6 digit code sent to you're Phone.">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    name="Phone"
                                    noStyle
                                    rules={[{ required: true, message: 'Please input the phone' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Button>Click here to get code</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Email" extra="Please enter 6 digit code sent to you're Email.">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    name="Email"
                                    noStyle
                                    rules={[{ required: true, message: 'Please input the email' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Button>Click here to get code</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </div>
        }
        return _types[confirmationStep]
    }
    handleCancel = () => {
        this.setState({ ...this.state, showModal: false, confirmationStep: "step1" })
    }
    handleOk = () => {
        let currentStep = parseInt(this.state.confirmationStep.split("step")[1]);
        if (currentStep === 3) {
            this.withDraw();
        } else {
            this.setState({ ...this.state, confirmationStep: "step" + (currentStep + 1) })
        }

    }

    handleModalClose = (childData) => {
        this.setState({ ...this.state, showFuntransfer: childData })
    }

    render() {
        const { Text } = Typography;
        const { cryptoWithdraw: { selectedWallet } } = this.props.sendReceive;
        if (this.state.isWithdrawSuccess) {
            return <SuccessMsg onBackCLick={() => this.props.changeStep("step1")} />
        }
        if (this.state.isVerificationLoading) {
            return <Loader />
        }
        if (!this.state.isVerificationMethodsChecked) {
            return <Alert
                message="Verification alert !"
                description={<Text>Without verifications you can't send. Please select send verifications from <a onClick={() => {
                    this.props.onDrawerClose();
                    this.props.history.push("/userprofile/2")
                }}>security section</a></Text>}
                type="warning"
                showIcon
                closable={false}
            />
        }
        return (
            <div ref={this.myRef}>
                <div> {this.state.error != null && <Alert type="error"
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

                    <Card className="crypto-card select mb-36" bordered={false}>

                        <div className="crypto-details d-flex">
                            <div>
                                <span className="d-flex align-center mb-4">
                                    <Image preview={false} src={selectedWallet.impageWhitePath} />
                                    {/* <Text className="crypto-percent">{selectedWallet?.percentage}<sup className="percent fw-700">%</sup></Text> */}
                                </span>
                                <Text className="fs-24 text-purewhite ml-4">{selectedWallet?.coinFullName}</Text>

                            </div>
                            <div>

                                <div className="crypto-amount" >
                                    <Currency defaultValue={selectedWallet?.coinBalance} prefix={""} type={"text"} suffixText={selectedWallet?.coin} />
                                    <Currency defaultValue={selectedWallet?.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                                </div>
                            </div></div>
                    </Card>
                    {/* <LocalCryptoSwap ref={this.eleRef} showConvertion={false}
                        isSwap={this.state.isSwap}
                        cryptoAmt={this.state.CryptoAmnt}
                        localAmt={this.state.USDAmnt}
                        cryptoCurrency={selectedWallet?.coin}
                        localCurrency={"USD"}
                        selectedCoin={selectedWallet?.coin}
                        // clickAmt={this.clickMinamnt}
                        // parentCallback = {this.clickMinamnt}
                        onConvertion={(val) => {
                            this.setState({ ...this.state, loading: val })
                        }}
                        onChange={({ localValue, cryptoValue, isSwaped, isInputChange }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped, amountPercentageType: isInputChange ? this.state.amountPercentageType : "" }) }} customerId={this.props.userProfile.id} screenName='withdrawcrypto' /> */}
                    {!this.state.isVerificationLoading &&
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
                                           {selectedWallet?.coin}
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
                                <Col xs={24} md={24} lg={24} xl={24} xxl={24} style={{marginTop:"-20px"}}>

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
                                                     if (_amt < selectedWallet?.withdrawMinValue) {
                                                        this.setState({ ...this.state, error: apicalls.convertLocalLang('amount_min') + " " + selectedWallet?.withdrawMinValue });
                                                        this.myRef.current.scrollIntoView();
                                                    } else if (_amt > selectedWallet?.withdrawMaxValue) {
                                                        this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_max') + " " + selectedWallet?.withdrawMaxValue });
                                                        this.myRef.current.scrollIntoView();
                                                    } else if (_amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
                                                        this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_less') });
                                                        this.myRef.current.scrollIntoView();
                                                    }
                                                    else {
                                                        this.setState({ ...this.state, isNewTransfer: false, amount: _amt, onTheGoObj: this.enteramtForm.current.getFieldsValue() }, () => {
                                                            this.enteramtForm.current.validateFields().then(() => this.validateAmt(_amt, "addressSelection", this.enteramtForm.current.getFieldsValue(), "addressLoader"))
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
                            {/* <Form.Item
                            className="custom-forminput custom-label mb-0"
                            name="CustomerRemarks"
                            label="Customer Remarks"
                            rules={[
                                {
                                    validator: validateContentRule
                                }
                            ]}
                        >
                            <Input
                                className="cust-input"
                                onChange={(event) => this.handleRemarkChange(event)}
                                maxLength={200}
                                placeholder="Customer Remarks"
                            />
                        </Form.Item> */}
                        </Form>
                    }
                    {/* <Translate content="Confirm_crypto" loading={this.state.loading} component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" /> */}
                    <Modal onCancel={() => { this.setState({ ...this.state, showModal: false }) }} title="Withdrawal" footer={[
                        <Button key="back" onClick={this.handleCancel} disabled={this.state.loading}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.loading}>
                            Confirm
                        </Button>
                    ]} visible={this.state.showModal}>
                        {this.renderModalContent()}
                    </Modal>
                    <Drawer
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
                    </Drawer>
                </div>
            </div>
        )
    }
}
const connectStateToProps = ({ sendReceive, userConfig, addressBookReducer }) => {
    return { addressBookReducer, sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
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
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CryptoWithDrawWallet));
