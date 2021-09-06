import { Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { setStep, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import { getMemberCoins } from "../../../reducers/swapReducer";
import connectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";
const { Title, Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, sellData: buyInfo,swapStore }) => {
    useEffect(() => { fetchMemberCoins(); }, []);
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins(userProfile.id));
    }
    const onCryptoCoinSelect = async (coin) => {
        dispatch(setStep("step7"))
        const response = await createCryptoDeposit({ memberId: userProfile?.id, walletCode: coin?.coin });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
        }
    }
    return <> <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary fw-200" />
        <div className="dep-withdraw auto-scroll">
            <CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} />
        </div></>
}

export default connectStateProps(CryptoDeposit);