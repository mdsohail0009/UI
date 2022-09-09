import React, { Component } from 'react';
import { Input,Drawer,Typography } from 'antd';
import { favouriteFiatAddress } from '../addressbook.component/api';
import { setAddress, setStep, setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import oops from '../../assets/images/oops.png'
import Loader from '../../Shared/loader';

import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';
import { setAddressStep} from "../../reducers/addressBookReducer";
import CryptoTransfer from '../onthego.transfer/crypto.transfer';
const { Paragraph, Text } = Typography;
class SelectAddress extends Component {
    state = {
        addressLu: [],
        filterObj: [],
        loading: false,
        showFuntransfer:false
    }
    async componentDidMount() {
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
        //this.props.dispatch(setSubTitle(apicalls.convertLocalLang('select_address')));
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
        const { filterObj, loading } = this.state;
        const { Search } = Input;
        return (
            <>
                {loading ? <Loader /> : <>
                    <Search placeholder={apicalls.convertLocalLang('searchAddress')}
                        addonAfter={<span className="icon md search-white" />} onChange={({ currentTarget }) => { this.handleSearch(currentTarget.value) }} size="middle" bordered={false} className="my-16" />
               

                    {(filterObj.length > 0)&&<>
                        <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                            {filterObj?.map((item, idx) =>
                                <li onClick={() => this.handleSelectAdd(item)} key={idx}
                                    className={item.lable === this.props.sendReceive?.addressObj?.lable ? "select" : " "}
                                > <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Account Holder:</span><span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.accountHolderName}</span></p>
                                <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Label:</span><span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.lable}</span></p>
                                <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-12 fw-100 xxl-fs-16"> Address: </span> <span className=" text-white-50 fs-10 fw-500 xxl-fs"> {item.address}</span></p>
                                </li>
                            )}
                        </ul> </>}
                    {(!filterObj.length > 0)&&<div className="success-pop text-center" style={{ marginTop: '20px' }}>
                            <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                            <h1 className="fs-36 text-white-30 fw-200 mb-0" > {apicalls.convertLocalLang('oops')}</h1>
                            <p className="fs-16 text-white-30 fw-200 mb-0"> {apicalls.convertLocalLang('address_available')} </p>
                            <a onClick={() => this.selectCrypto()}>Click hear to make New Transfer</a>
                        </div>}
                    </>
                 
                }
                 
                     <Drawer
                    destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        <div className="text-center fs-16 fw-500">
                            <Paragraph className='text-white'>Fund Transfer</Paragraph>
                        </div>
                        <span onClick={() => this.setState({ ...this.state, showFuntransfer: false })} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer w-50p"
                    visible={this.state.showFuntransfer}
                >
                     <CryptoTransfer/>
                </Drawer>
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
export default connect(connectStateToProps, connectDispatchToProps)(SelectAddress);
