import React, { Component } from 'react';
import { Typography} from 'antd';
import { setSelectedSellCoin, setSellHeaderHide, setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { setCoinWallet, updateCoinDetails } from '../../reducers/buy.reducer';   // do not remove this line time being i will check // subbareddy
import Loader from '../../Shared/loader'
import { getMemberCoins, updateCoinDetail } from '../../reducers/sellReducer';
import { setCoin, setExchangeValue } from '../../reducers/buyReducer';
import { getSelectedCoinDetails } from '../buy.component/api'
import CryptoList from '../shared/cryptolist';
import Translate from 'react-translate-component';

class SellToggle extends Component {
    state = {
        loading: false,
    }
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.customer?.id)
    }
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    setCoinDetailData = async (coin) => {
        this.setState({ ...this.state, loading: true });
        let res = await getSelectedCoinDetails(coin.coin);
        if (res.ok) {
            this.props.setSelectedCoin(res.data); this.props.changeStep('step10');
            this.props.dispatch(setSelectedSellCoin(true));
            this.props.dispatch(setSellHeaderHide(false));
        }
        this.setState({ ...this.state, loading: false })
    }
    render() {
        const { Paragraph } = Typography;
        if (this.props.sellData?.memberCoins?.loading||this.state.loading) { return <Loader /> }
        return (
            <>

                {/* <div className='text-center selctcoin-style'><div className='drawer-maintitle'>Sell Crypto</div>
                      <Translate content="buy_your_crypto_for_cash_text" component={Paragraph} className="label-style drawer-subtextstyle" /></div> */}
                <div className="sellcrypto-container">
                <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="label-style" />

    <CryptoList ref={this.ref} isLoading={this.state?.loading} showSearch={true} coinList={this.props?.sellData?.memberCoins?.data} coinType="Sell" onCoinSelected={(coin) => this.setCoinDetailData(coin)} />
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, sellInfo, userConfig }) => {
    return { buySell, sellData: sellInfo, customer: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins: (customer_id) => {
            dispatch(getMemberCoins(customer_id))
        },
        setSelectedCoin: (coinWallet) => {
            dispatch(setCoin(coinWallet));
            dispatch(updateCoinDetail(coinWallet))
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
