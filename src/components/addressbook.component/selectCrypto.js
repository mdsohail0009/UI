import React, { Component } from 'react';
import { Alert } from 'antd';
import { setAddressStep, setAddressCoin, fetchSelectedCoinDetails, setExchangeValue, fetchAddressCrypto } from '../../reducers/addressBookReducer';
import { connect } from 'react-redux';
import CryptoList from '../shared/cryptolist';
import { getCoinList } from './api';
// import { convertCurrency } from '../buy.component/buySellService';

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: null,
        coinDetails: null,
        errorMessage: null,
        coinsList: [],
        isLoading: true,
    }
    useDivRef = React.createRef();
    componentDidMount() {
        this.coinList();
    }
    coinList = async () => {
        let fromlist = await getCoinList("All")      
          if (fromlist.ok) {
            this.setState({ ...this.state, coinsList: fromlist.data, isLoading: false })
        } else {
            this.setState({ ...this.state, coinsList: [], isLoading: false })
        }
    }
    onSearch = (e) => {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches });
    }

    handleCoinSelection = (selectedCoin) => {
        let cryptoValues = this.props.addressBookReducer.cryptoValues;
        this.props.InputFormValues({ ...cryptoValues, toCoin: selectedCoin.walletCode })
        this.props.setSelectedCoin(selectedCoin);
        this.props.changeStep('step1')
    }
    render() {
        return (<><div ref={this.useDivRef}></div>
            {this.state.errorMessage != null && <Alert
                description={this.state.errorMessage}
                type="error"
                showIcon
                closable={false}
            />}
            <CryptoList showSearch={true} showValues={true} titleField={'walletCode'} iconField={'walletCode'}
                coinList={this.state.coinsList} selectedCoin={this.props.addressBookReducer.coinWallet ? this.props.addressBookReducer.coinWallet : this.props.addressBookReducer?.selectedRowData} onReturnCoin={true} isLoading={this.state.isLoading} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
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
            dispatch(setAddressCoin(coinWallet));
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        },
        InputFormValues: (cryptoValues) => {
            dispatch(fetchAddressCrypto(cryptoValues));
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);
