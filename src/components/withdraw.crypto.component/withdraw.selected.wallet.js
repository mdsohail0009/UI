import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, Alert, Row, Col, Form, Modal, Tooltip } from 'antd';
import { handleSendFetch, setStep, setSubTitle, setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Currency from '../shared/number.formate';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import { withDrawCrypto } from '../send.component/api';
import SuccessMsg from './success';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import { favouriteFiatAddress } from '../addressbook.component/api'
import oops from '../../assets/images/oops.png'

class CryptoWithDrawWallet extends Component {
    eleRef = React.createRef();
    myRef = React.createRef();
    state = {
        CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue,
        USDAmnt: "",
        isSwap: true,
        error: null,
        walletAddress: null,
        loading: false,
        showModal: false,
        confirmationStep: "step1",
        isWithdrawSuccess: false,
        addressLu: [],
        isSelectAddress: false,
        isAddressValue:false,
      
    }
    componentDidMount() {
        if(this.props.sendReceive.withdrawCryptoObj){
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.withdrawCryptoObj?.totalValue, localValue: 0 })
            this.setState({ ...this.state, walletAddress:this.props.sendReceive.withdrawCryptoObj.toWalletAddress });
        }else{
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
        }
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 2 }))
        this.props.dispatch(setSubTitle("Select wallet address"));
        this.trackevent();
    }
    trackevent = () => {
        appInsights.trackEvent({
            name: 'WithDraw Crypto', properties: { "Type": 'User', "Action": 'Page view', "Username": this.props.userProfile.userName, "MemeberId": this.props.userProfile.id, "Feature": 'WithDraw Crypto', "Remarks": "WithDraw crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'WithDraw Crypto' }
        });
    }
    componentWillUnmount() {
        this.setState({ ...this.state, isWithdrawSuccess: false });
    }
    getAddressLu = async () => {
        let membershipId = this.props.userProfile.id;
        let coin_code = this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coin;
        let recAddress = await favouriteFiatAddress(membershipId, 'crypto', coin_code)
        if (recAddress.ok) {
            this.setState({ addressLu: recAddress.data });
        }
        else {
            this.setState({ isaddressLu: true })
        }
    }
    selectCrypto = () => {
        this.setState({ ...this.state, isSelectAddress: true, isAddressValue:true })
        this.getAddressLu();
    }
    handleSelectAdd = (selectadd) => {
        let val= selectadd.currentTarget.innerText
        let res = this.state.addressLu;
        let index = res.findIndex(function (o) { return o.name !== val; })
        let labelname = res[index].name;
        if(labelname !== val){
            let setAddress = res[index].id
            this.setState({ ...this.state, walletAddress: setAddress, isSelectAddress: false })
        }
    }
    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sendReceive?.cryptoWithdraw?.selectedWallet)
        if (type !== 'half') {
            usdamnt = (obj.coinValueinNativeCurrency / 2).toString();
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else if (type !== 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 });
        }
    }
    handlePreview = () => {
        const amt = parseFloat(this.state.CryptoAmnt);
        const { withdrawMaxValue, withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (!amt) {
            this.setState({ ...this.state, error: `Enter amount` });
            this.myRef.current.scrollIntoView();
        }
        else if (amt < withdrawMinValue) {
            this.setState({ ...this.state, error: `Please enter min value of ${withdrawMinValue}` });
            this.myRef.current.scrollIntoView();
        } else if (amt > withdrawMaxValue) {
            this.setState({ ...this.state, error: `Entered amount should be less than max withdraw amount of ${withdrawMaxValue}` });
            this.myRef.current.scrollIntoView();
        } else if (amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
            this.setState({ ...this.state, error: `Entered amount should be less than available balance` });
            this.myRef.current.scrollIntoView();
        }
        else if (!this.state.walletAddress) {
            this.setState({ ...this.state, error: `Please enter valid wallet address` });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.withDraw();
        }
    }
    withDraw = async () => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null, loading: true, isWithdrawSuccess: false });
        
        let obj = {
            "membershipId": this.props.userProfile.id,
            "memberWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": ""
        }
        if (this.props.userProfile.isBusiness) {
            const response = await withDrawCrypto(obj);
            this.setState({ ...this.state, loading: false, showModal: false })
            if (response.ok) {
                this.setState({ ...this.state, isWithdrawSuccess: true });
                this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
                appInsights.trackEvent({
                    name: 'WithDraw Crypto', properties: { "Type": 'User', "Action": 'Save', "Username": this.props.userProfile.userName, "MemeberId": this.props.userProfile.id, "Feature": 'WithDraw Crypto', "Remarks": "WithDraw crypto save", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'WithDraw Crypto' }
                });
            } else {
                this.setState({ ...this.state, error: response.data, confirmationStep: "step1", showModal: false, isWithdrawSuccess: false })
            }
        } else {
            this.props.dispatch(setSubTitle("Live verification"));
            this.props.dispatch(setWithdrawcrypto(obj))
            this.props.changeStep('withdraw_crypto_liveness');
        }
    }
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
                                <Button>Get Code</Button>
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
                                <Button>Get Code</Button>
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
        if (currentStep !== 3) {
            this.withDraw();
        } else {
            this.setState({ ...this.state, confirmationStep: "step" + (currentStep + 1) })
        }

    }
    render() {
        const { Text } = Typography;
        const { cryptoWithdraw: { selectedWallet } } = this.props.sendReceive;
        const { addressLu } = this.state;
        if (this.state.isWithdrawSuccess) {
            return <SuccessMsg onBackCLick={() => this.props.changeStep("step1")} />
        }
        return (
            <div ref={this.myRef}>
                {!this.state.isSelectAddress ? <div> {this.state.error != null && <Alert closable type="error"
                    //message={"Withdraw Crypto"}
                    description={this.state.error} onClose={() => this.setState({ ...this.state, error: null })} showIcon />}

                    <Card className="crypto-card select mb-36" bordered={false}>
                        <span className="d-flex align-center">
                            <span className={`coin lg ${selectedWallet?.coin}`} />
                            <Text className="fs-24 text-purewhite ml-8">{selectedWallet?.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent fw-700">{selectedWallet?.percentage}<sup className="percent fw-700">%</sup></Text>
                            <div className="crypto-amount">
                                <Currency defaultValue={selectedWallet?.coinBalance} prefix={""} type={"text"} suffixText={selectedWallet?.coin} />
                                <Currency defaultValue={selectedWallet?.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                            </div>
                        </div>
                    </Card>
                    <LocalCryptoSwap ref={this.eleRef}
                        isSwap={this.state.isSwap}
                        cryptoAmt={this.state.CryptoAmnt}
                        localAmt={this.state.USDAmnt}
                        cryptoCurrency={selectedWallet?.coin}
                        localCurrency={"USD"}
                        selectedCoin={selectedWallet?.coin}
                        onChange={({ localValue, cryptoValue, isSwaped }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped }) }}   memberId={this.props.userProfile.id}/>
                    <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                        <Translate value="min" content="min" component={Radio.Button} onClick={() => this.clickMinamnt("min")} />
                        <Translate value="half" content="half" component={Radio.Button} onClick={() => this.clickMinamnt("half")} />
                        <Translate value="all" content="all" component={Radio.Button} onClick={() => this.clickMinamnt("all")} />
                    </Radio.Group>

                    <Form>
                        <Form.Item
                            name="toWalletAddress"
                            className="custom-forminput custom-label  mb-16"
                            required
                            label="Address"
                            rules={[
                                {
                                    type: "toWalletAddress", validator: async (rule, value, callback) => {
                                        if (value !== null || value.trim() !== "") {
                                            throw new Error("Is required")
                                        }
                                        else {
                                            callback();
                                        }
                                    }
                                }
                            ]}
                        >
                           
                            <div className="p-relative d-flex align-center">
                                {!this.state.isAddressValue ?
                                    <Input className="cust-input custom-add-select mb-0" placeholder="Enter address"
                                        onChange={({ currentTarget: { value } }) => this.setState({ ...this.state, walletAddress: value })} />
                                    :
                                    <Input className="cust-input custom-add-select mb-0" placeholder="Enter address" value={this.state.walletAddress}
                                        onChange={({ currentTarget: { value } }) => this.setState({ ...this.state, walletAddress: value })}
                                    />
                                }
                                <Tooltip placement="top" title={<span>Select Address</span>} style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer" onClick={() => this.selectCrypto()}>
                                        <span className="icon md address-book d-block c-pointer"></span>
                                    </div>
                                </Tooltip>
                            </div>
                        </Form.Item>
                    </Form>
                    <Translate content="with_draw" loading={this.state.loading} component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" />
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
                </div> : <>
                    {addressLu.length > 0 ? <>
                    <h1 className="basicinfo">Address Book</h1>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {addressLu?.map((item, idx) =>
                            <li onClick={(selectadd) => this.handleSelectAdd(selectadd)} key={idx} > {item.name}</li>
                        )}
                    </ul> </>:
                        <div className="success-pop text-center" style={{marginTop:'20px'}}>
                            <img src={oops} className="confirm-icon" style={{marginBottom:'10px'}} alt={"image"} />
                           <h1 className="fs-36 text-white-30 fw-200 mb-0" >OOPS </h1>
                            <p className="fs-16 text-white-30 fw-200"> No Address Avaliable </p>
                        </div>
                    }



                </>
                }
            </div>


        )
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoWithDrawWallet);
