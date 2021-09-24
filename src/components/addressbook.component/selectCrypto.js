import React, { Component } from 'react';
import { Typography, Button, Input, List, Empty, Alert } from 'antd';
import Translate from 'react-translate-component';
import { setAddressStep, setCoin, fetchSelectedCoinDetails, setExchangeValue} from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import CryptoList from '../shared/cryptolist';
import { appInsights } from "../../Shared/appinsights";
import { getCoinList } from './api';
import { convertCurrency } from '../buy.component/buySellService';

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: null,
        coinDetails: null,
        errorMessage: null,
        coinsList:[],
        isLoading:true,
    }
    useDivRef = React.createRef();
    componentDidMount() {
        this.coinList();
    }
    coinList = async() =>{
        let  fromlist =  await getCoinList(this.props.userProfile?.id)
         if(fromlist.ok){
             this.setState({...this.state,coinsList:fromlist.data,isLoading:false})
         }else{
             this.setState({...this.state,coinsList:[],isLoading:false})
         }
     }
    onSearch = (e) => {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches });
    }

    handleCoinSelection = (selectedCoin) => {
        debugger;
            this.props.getCoinDetails(selectedCoin, this.props.userProfile?.userId);
            this.props.setSelectedCoin(selectedCoin);
            convertCurrency({ from: selectedCoin.walletCode, to: "USD", value: 1, isCrypto: false }).then(val => {
                this.props.setExchangeValue({ key: selectedCoin.walletCode, value: val });
            })
            this.props.changeStep('step1')
    }
    // pickCoin = ()=>{
    //     debugger;
    //     if (this.state.coinDetails != null && this.state.coinDetails.id) {
    //         this.props.getCoinDetails(selectedCoin.walletCode, this.props.member?.id);
               // this.props.setSelectedCoin(selectedCoin);
    //         this.props.changeStep('step1') 
    //     } else { 
    //         this.useDivRef.current.scrollIntoView()
    //         this.setState({ ...this.state, errorMessage: 'Please select coin to swap' })
    //     }
    // }
    render() {
        const { Search } = Input;
        const { addLinks } = this.state;
        const { Paragraph, Text } = Typography;

        return (<><div ref={this.useDivRef}></div>
            {this.state.errorMessage != null && <Alert
                //message="this.state.errorMessage"
                description={this.state.errorMessage}
                type="error"
                showIcon
                closable={false}
            />}
            <CryptoList coinType="swap" showSearch={true} showValues={true} titleField={'coin'} iconField={'coin'}
             coinList={this.state.coinsList} isLoading={this.state.isLoading} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
        </>)
    }
}
const connectStateToProps = ({ addressBookReducer, userConfig }) => {
    return { addressBookReducer, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setAddressStep(stepcode))
        },
        getCoinDetails: (coin, memid) => {
            dispatch(fetchSelectedCoinDetails(coin, memid));
        },
        setSelectedCoin: (coinWallet) => {
            dispatch(setCoin(coinWallet));
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);
