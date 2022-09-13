import { Typography } from "antd";
import { useState,useEffect } from "react";
import Translate from "react-translate-component";
import { setStep, setSubTitle, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import { getMemberCoins } from "../../../reducers/swapReducer";
import ConnectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";
import apicalls from "../../../api/apiCalls";
import { fetchDashboardcalls } from "../../../reducers/dashboardReducer";
import { getFeaturePermissionsByKeyName } from '../../shared/permissions/permissionService'

const { Title, Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, swapStore }) => {
    useEffect(() => { fetchMemberCoins(); getFeaturePermissionsByKeyName(`sendreceivecrypto`)}, []);
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins(userProfile.id));
    }
    const onCryptoCoinSelect = async (coin) => {
        dispatch(setStep("step7"));
        // dispatch(setSubTitle(`${coin.coinBalance ? coin.coinBalance : '0'} ${coin.coin}` + " " + apicalls.convertLocalLang('available')
        // ));
        dispatch(setSubTitle(` ${coin.coin}` + " " + "balance" +" "+ ":" +" "+ `${coin.coinBalance ? coin.coinBalance : '0'}`+`${" "}`+`${coin.coin}`
        ));
        const response = await createCryptoDeposit({ customerId: userProfile?.id, walletCode: coin?.coin });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
            dispatch(fetchDashboardcalls(userProfile?.id));
        }
    }
    return <>
        {/* <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fw-200 mb-8 custom-font mt-16" /> */}
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="text-white-30 fw-300 fs-14 mt-16" />
        <div className="dep-withdraw auto-scroll">
            <CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.isLoading ? [] : swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} />
        </div>
        </>
}

export default ConnectStateProps(CryptoDeposit);