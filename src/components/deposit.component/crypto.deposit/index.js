import { Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { setSendSelectedCoin, setStep, setSubTitle, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import { getMemberCoins } from "../../../reducers/swapReducer";
import connectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";
import { appInsights } from "../../../Shared/appinsights";
const { Title, Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, sellData: buyInfo,swapStore }) => {
    useEffect(() => { fetchMemberCoins(); trackevent()}, []);
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins(userProfile.id));
    }
    const onCryptoCoinSelect = async (coin) => {
        dispatch(setStep("step7"));
        dispatch(setSubTitle(`${coin.coinBalance?coin.coinBalance:'0'} ${coin.coin} available`));
        const response = await createCryptoDeposit({ memberId: userProfile?.id, walletCode: coin?.coin });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
        }
    }
    const trackevent =() =>{
        appInsights.trackEvent({
            name: 'Deposit Crypto', properties: {"Type": 'User',"Action": 'Page view',"Username":userProfile.email,"MemeberId": userProfile.id,"Feature": 'Deposit Crypto',"Remarks": "Deposit crypto page view","Duration": 1,"Url": window.location.href,"FullFeatureName": 'Deposit Crypto'}
        });
    }
    return <> <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary fw-200" />
        <div className="dep-withdraw auto-scroll">
            <CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} />
        </div></>
}

export default connectStateProps(CryptoDeposit);