
import React, { Component } from 'react';
import { Typography, Button, Drawer, Card, Input, Radio, Alert, Row, Col, Form, Modal, Tooltip, Image } from 'antd';
import { handleSendFetch, setStep, setSubTitle, setWithdrawcrypto, setAddress } from '../../reducers/sendreceiveReducer';
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
import AddressCommonCom from "../addressbook.component/addressCommonCom";
import SelectCrypto from "../addressbook.component/selectCrypto";
import apiCalls from "../../api/apiCalls";
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../../Shared/loader';
import CryptoTransfer from "../onthego.transfer/crypto.transfer"
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService';
import { handleNewExchangeAPI } from "../send.component/api";

const { Paragraph, Text } = Typography;

class CryptoWithDrawWallet extends Component {
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
            showFuntransfer:false,
            errorMsg:null
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
                this.eleRef.current?.handleConvertion({ cryptoValue: this.props.sendReceive?.withdrawCryptoObj?.totalValue, localValue: 0 })
                this.setState({ ...this.state, walletAddress: this.props.sendReceive.withdrawCryptoObj.toWalletAddress, amountPercentageType: this.props.sendReceive.withdrawCryptoObj.amounttype });
            } else {
                this.eleRef.current?.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
            }
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

    };
    renderContent = () => {
        const stepcodes = {
            cryptoaddressbook: (<>
                {/* <NewAddressBook onCancel={() => this.closeBuyDrawer()} /> */}
                <AddressCommonCom onCancel={(obj) => this.closeBuyDrawer(obj)} cryptoTab={1} />
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
    selectCrypto = (type) => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.props.dispatch(setSubTitle(apicalls.convertLocalLang('select_address')));
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
        this.setState({ ...this.state, loading: true })
        if (type == "ADDRESS") {
            this.props.changeStep('step8');
        } else {
            this.setState({
                ...this.state, visible: true, errorWorning: null, showFuntransfer: true
                // , selection: [],
                // isCheck: false,
            });
        }


    }

    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sendReceive?.cryptoWithdraw?.selectedWallet)
        if (type === 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ ...this.state, USDAmnt: usdamnt, CryptoAmnt: cryptoamnt, amountPercentageType: 'all' });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.setState({ ...this.state, CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, amountPercentageType: 'min' });
            this.eleRef.current.changeInfo({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 });
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
			this.setState({ ...this.state, loading: false,errorMsg:this.isErrorDispaly(response) });
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

    handleModalClose=(childData)=>{
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
                                    <Text className="crypto-percent">{selectedWallet?.percentage}<sup className="percent fw-700">%</sup></Text>
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
                    <LocalCryptoSwap ref={this.eleRef} showConvertion={false}
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
                        onChange={({ localValue, cryptoValue, isSwaped, isInputChange }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped, amountPercentageType: isInputChange ? this.state.amountPercentageType : "" }) }} customerId={this.props.userProfile.id} screenName='withdrawcrypto' />
                    <div class="minmax ">
                        <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn with-min" onClick={() => this.clickMinamnt("min")}>
                            <span >Min</span>
                        </button>
                        <button type="button" class="ant-btn ant-btn-text ant-btn-sm min-btn with-max" onClick={() => this.clickMinamnt("all")}>
                            <span>Max</span>
                        </button>
                    </div>

                    <Form>
                        <Form.Item
                            name="toWalletAddress"
                            className="custom-forminput custom-label  mb-16"
                            required
                            label={apicalls.convertLocalLang('sendTo')}
                        >
                            <div className="p-relative d-flex align-center">
                                <Input className="cust-input custom-add-select mb-0" placeholder={apicalls.convertLocalLang('enter_address')} value={this.state.walletAddress}

                                    disabled={true} onChange={({ currentTarget: { value } }) => { this.setState({ ...this.state, walletAddress: value }); this.props.clearAddress(null) }}
                                    maxLength="250" />
                                {/* <Tooltip placement="top" title="Send to new wallet" style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer" style={{borderRadius:'0'}} onClick={() => this.selectCrypto()}>
                                        <span className="icon md diag-arrow d-block c-pointer"></span>
                                    </div>
                                </Tooltip> */}
                                <Tooltip placement="top" title={<span>{apicalls.convertLocalLang('SelectAddress')}</span>} style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer" onClick={() => this.selectCrypto("ADDRESS")}>
                                        <span className="icon md diag-arrow d-block c-pointer"></span>
                                    </div>
                                </Tooltip>
                            </div>
                        </Form.Item>
                        <div className="text-center mt-24 mb-24 ">
                        <Button key="back" className='ant-btn  pop-btn'   onClick={() => this.selectCrypto()} >
                            New Transfer
                        </Button>,
                        <Button key="submit" type="primary" className='ant-btn  pop-btn' style={{marginLeft:"10px"}} onClick={() => this.selectCrypto("ADDRESS")}>
                            Whitelisted Address
                        </Button>
                        </div>
                        <Form.Item
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
                        </Form.Item>
                    </Form>
                    <Translate content="Confirm_crypto" loading={this.state.loading} component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" />
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
