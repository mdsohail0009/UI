import React, { Component } from 'react';
import { Typography, Space ,Input} from 'antd';
import { favouriteFiatAddress } from '../addressbook.component/api';
import {  setAddress, setStep,setWithdrawcrypto} from '../../reducers/sendreceiveReducer';
import oops from '../../assets/images/oops.png'
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';


class SelectAddress extends Component {
    state={
        addressLu: [],
        filterObj: [],
        loading:false,
    }
    componentDidMount() {
        this.getAddressLu();
    }
    getAddressLu = async () => {
       this.setState({...this.state,loading: true})
        let membershipId = this.props.userProfile.id;
        let coin_code = this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coin;
        let recAddress = await favouriteFiatAddress(membershipId, 'crypto', coin_code)
        if (recAddress.ok) {
            this.setState({...this.state, addressLu: recAddress.data, loading: false, filterObj: recAddress.data });
        }
        else{this.setState({...this.state, loading: true})}
    }
    handleSearch = (value) => {
        let filteraddresslabel;
        if (!value) {
            filteraddresslabel = this.state.addressLu;
        } else {
            filteraddresslabel = this.state.addressLu.filter(item => (item.name).toLowerCase().includes(value.toLowerCase()));
        }
        this.setState({ ...this.state, filterObj: filteraddresslabel })
    }
    handleSelectAdd= (item) =>{
        this.props.SelectedAddress(item)
       let obj= this.props.sendReceive.withdrawCryptoObj;
        this.props.dispatch(setWithdrawcrypto({...obj, toWalletAddress: item.code}))
        this.props.changeStep('withdraw_crypto_selected');
         
    }
    render() {
        const { Title, Paragraph } = Typography;
        const {filterObj ,loading} = this.state;
        const { Search } = Input;
        return (
            <>
                {loading ? <Loader /> :<>
                <Search placeholder="Search address label"
                    addonAfter={<span className="icon md search-white" />} onChange={({ currentTarget }) => { this.handleSearch(currentTarget.value) }} size="middle" bordered={false} className="my-16" />
                {filterObj.length > 0 ? <>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, }} className="addCryptoList">
                        {filterObj?.map((item, idx) =>
                            <li onClick={() => this.handleSelectAdd(item)} key={idx}
                                className={item.name === this.props.sendReceive?.addressObj?.name ? "select" : " "}
                            > <p className="fs-16 mb-0 "> <span className=" text-white-50 fs-14 fw-100"> Label:</span> {item.name}</p>
                                <p className="fs-16 mb-0"> <span className=" text-white-50 fs-14 fw-100"> Address:</span> {item.code}</p>
                            </li>
                        )}
                    </ul> </> :
                    <div className="success-pop text-center" style={{ marginTop: '20px' }}>
                        <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
                        <h1 className="fs-36 text-white-30 fw-200 mb-0" >OOPS </h1>
                        <p className="fs-16 text-white-30 fw-200 mb-0"> No address available </p>
                    </div>
           }</>
           }
            </>
        );
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
        SelectedAddress: (addressObj) => {
            dispatch(setAddress(addressObj));
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectAddress);
