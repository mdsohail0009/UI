import { Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { fetchCoins } from "../../../reducers/buyReducer";
import { setStep, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import connectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";
const { Title, Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, sellData: buyInfo }) => {
    useEffect(() => { fetchMemberCoins(); }, []);
    const fetchMemberCoins = () => {
        dispatch(fetchCoins("All"))
    }
    const onCryptoCoinSelect = async (coin) => {
        dispatch(setStep("step7"))
        const response = await createCryptoDeposit({ memberId: userProfile?.id, walletCode: coin?.walletCode });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
        }
    }
    return <> <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary fw-200" />
        <div className="dep-withdraw auto-scroll">
            <CryptoList showSearch={true} showValues={true} coinList={buyInfo?.coins["All"]?.data} isLoading={buyInfo?.coins["All"]?.loading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} />
        </div></>
}

export default connectStateProps(CryptoDeposit);