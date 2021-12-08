import { Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { setStep, setSubTitle, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import { getMemberCoins } from "../../../reducers/swapReducer";
import ConnectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";
import apicalls from "../../../api/apiCalls";
const { Title, Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, swapStore }) => {
    useEffect(() => { fetchMemberCoins(); trackevent() }, []);
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins(userProfile.id));
    }
    const onCryptoCoinSelect = async (coin) => {
        dispatch(setStep("step7"));
        dispatch(setSubTitle(`${coin.coinBalance ? coin.coinBalance : '0'} ${coin.coin}` + " " + apicalls.convertLocalLang('available')
        ));
        const response = await createCryptoDeposit({ memberId: userProfile?.id, walletCode: coin?.coin });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
        }
    }
    const trackevent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Crypto page view', "Username": userProfile.userName, "MemeberId": userProfile.id, "Feature": 'Deposit Crypto', "Remarks": "Deposit crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Crypto'
        });
    }
    return <> <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fw-200 mb-8 custom-font mt-16" />
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary fw-200" />
        <div className="dep-withdraw auto-scroll">
            <CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.isLoading ? [] : swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} />
        </div></>
}

export default ConnectStateProps(CryptoDeposit);