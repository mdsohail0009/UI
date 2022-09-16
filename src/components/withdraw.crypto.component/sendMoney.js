import React, { Component } from 'react';
import { Input,Drawer,Typography,Alert,Col,Row, } from 'antd';
import { favouriteFiatAddress } from '../addressbook.component/api';
import { setAddress, setStep, setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import oops from '../../assets/images/oops.png'
import Loader from '../../Shared/loader';

import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';
import { setAddressStep} from "../../reducers/addressBookReducer";
import CryptoTransfer from '../onthego.transfer/crypto.transfer';
const { Paragraph, Text, Title } = Typography;
class SendMoney extends Component {
    
    state = {
        addressLu: [],
        filterObj: [],
        loading: false,
        showFuntransfer:false,
        pastPayees: []
    }
    async componentDidMount() {
        debugger
        this.getAddressLu();
        await this.trackevent()
    }
    trackevent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Withdraw Crypto Address page view  ', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto Address page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
        });
    }
    getAddressLu = async () => {
        this.setState({ ...this.state, loading: true })
        let customerId = this.props.userProfile.id;
        let coin_code = this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coin;
        let recAddress = await favouriteFiatAddress(customerId, 'crypto', coin_code)
        if (recAddress.ok) {
            this.setState({ ...this.state, addressLu: recAddress.data, loading: false, filterObj: recAddress.data });
        }
        else { this.setState({ ...this.state, loading: true }) }
    }
    handleSearch = (value) => {
        let filteraddresslabel;
        if (!value) {
            filteraddresslabel = this.state.addressLu;
        } else {
            filteraddresslabel = this.state.addressLu.filter(item => (item.name?item.name:item.lable)?.toLowerCase().includes(value.toLowerCase()));
        }
        this.setState({ ...this.state, filterObj: filteraddresslabel })
    }
    handleSelectAdd = (item) => {
        this.props.SelectedAddress(item)
        let obj = this.props.sendReceive.withdrawCryptoObj;
        this.props.dispatch(setWithdrawcrypto({ ...obj, toWalletAddress: item.address }))
        this.props.changeStep('withdraw_crypto_selected');
    }
  
    selectCrypto = (type) => {
        debugger
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        //this.props.dispatch(setSubTitle(apicalls.convertLocalLang('send_crypto_address')));
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
                ...this.state, showFuntransfer: true, errorWorning: null
                // , selection: [],
                // isCheck: false,
            });
        }


    }
    render() {
        const { filterObj, loading, pastPayees } = this.state;
        const { Search } = Input;
        return (
            <>
             {this.state.errorMessage && <Alert type="error" description={this.state.errorMessage} showIcon />}
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
                    <Text className="fs-14 mb-8 text-white d-block fw-200">
									Search for beneficiary *
								</Text>
                    <Search placeholder="Search for Payee" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="mt-12" />
                </Col>
                {this.state?.loading && <Loader />}
                {(!this.state.loading) && <>
                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Address Book</Title>
                    {/* <Divider className="cust-divide" /> */}

                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            <><Row className="fund-border c-pointer ">
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">R</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className="small-text-align">
                                    <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                        <strong>dfxghjk
                                        </strong>
                                    </label>
                                    <div><Text className="fs-16 text-white-30 m-0">fdghbnm</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row></>
                    </ul>

                    <Title className="fw-600 text-white px-4 mb-16 mt-16 text-captz" style={{ fontSize: '18px' }}>Past Recipients</Title>
                    {/* <Divider className="cust-divide" /> */}
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {(pastPayees?.length > 0) && pastPayees?.map((item, idx) =>
                            <Row className="fund-border c-pointer" onClick={async () => {
                                if (!["myself", "1stparty", "ownbusiness"].includes(item.addressType?.toLowerCase())) {
                                    this.setState({ ...this.state, addressOptions: { ...this.state.addressOptions, addressType: item.addressType }, selectedPayee: item }, () => this.chnageStep("reasonfortransfer"))
                                } else {
                                    this.setState({ ...this.state, loading: true, errorMessage: null, selectedPayee: item });
                                    // const res = await confirmTransaction({ payeeId: item.id, reasonOfTransfer: "", amount: this.state.amount });
                                    // if (res.ok) {
                                    //     this.setState({ ...this.state, reviewDetails: res.data, loading: false }, () => this.chnageStep("reviewdetails"));
                                    // } else {
                                    //     this.setState({ ...this.state, loading: false, errorMessage: res.data?.message || res.data || res.originalError.message });
                                    // }
                                }
                            }}>
                                <Col xs={2} md={2} lg={2} xl={3} xxl={3} className=""><div class="fund-circle text-white">{item?.name.charAt(0).toUpperCase()}</div></Col>
                                <Col xs={24} md={24} lg={24} xl={19} xxl={19} className=" small-text-align">
                                    <label className="fs-16 fw-600 text-upper text-white-30 l-height-normal">
                                        <strong>{item.name}
                                            {/* <small>{item.type}</small> */}
                                        </strong>
                                    </label>
                                    <div><Text className="fs-16 text-white-30 m-0">{this.state.selectedCurrency} account ending with {item.accountNumber?.substr(item.accountNumber?.length - 4)}</Text></div>
                                </Col>
                                <Col xs={24} md={24} lg={24} xl={2} xxl={2} className="mb-0 mt-8">
                                    <span class="icon md rarrow-white"></span>
                                </Col>
                            </Row>

                        )}
                        {(!pastPayees?.length > 0) && <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {'You have no past recipients'} </p>
                            {/* <a onClick={() => this.chnageStep("newtransfer")}>Click here to make new transfer</a> */}
                        </div>}
                    </ul>
                </>}
             </>    
        );
    }
}
const connectStateToProps = ({ sendReceive, userConfig,addressBookReducer }) => {
    return { addressBookReducer,sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        SelectedAddress: (addressObj) => {
            dispatch(setAddress(addressObj));
        },
       
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SendMoney);
