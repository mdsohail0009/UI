import { Typography, Alert, Spin } from "antd";
import { useState,useEffect } from "react";
import Translate from "react-translate-component";
import { setStep, setSubTitle, setWalletAddress } from "../../../reducers/sendreceiveReducer";
import { getMemberCoins } from "../../../reducers/swapReducer";
import ConnectStateProps from "../../../utils/state.connect";
import CryptoList from "../../shared/cryptolist"
import { createCryptoDeposit } from "../api";

import { fetchDashboardcalls } from "../../../reducers/dashboardReducer";
import { getFeaturePermissionsByKeyName } from '../../shared/permissions/permissionService'
import Loader from "../../../Shared/loader";

const {  Paragraph } = Typography;
const CryptoDeposit = ({ dispatch, userProfile, swapStore }) => {
    useEffect(() => { fetchMemberCoins();
       getFeaturePermissionsByKeyName(`send_crypto`)}, []);;//eslint-disable-line react-hooks/exhaustive-deps
    const [errorMsg,seterrorMsg] = useState(null)
    const [loading,setLoading] = useState(null)
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins());
    }
    const onCryptoCoinSelect = async (coin) => {
        // dispatch(setSubTitle(`${coin.coinBalance ? coin.coinBalance : '0'} ${coin.coin}` + " " + apicalls.convertLocalLang('available')
        // ));
        setLoading(true)
        const response = await createCryptoDeposit({ customerId: userProfile?.id, walletCode: coin?.coin, network: coin?.netWork });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
            dispatch(fetchDashboardcalls(userProfile?.id));
            dispatch(setStep("step7"));
            dispatch(setSubTitle(` ${coin.coin}` +" " + "balance" +" "+ ":" +" "+ `${coin.coinBalance ? coin.coinBalance : '0'}`+`${" "}`+`${coin.coin}`));
        }else{
            seterrorMsg(isErrorDispaly(response))
        }
        setLoading(false)
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
          return objValue.data;
        } else if (
          objValue.originalError &&
          typeof objValue.originalError.message === "string"
        ) {
          return objValue.originalError.message;
        } else {
          return "Something went wrong please try again!";
        }
      };
    return <>
    {swapStore.isLoading && <Loader />}
    {errorMsg !== null && (
                <Alert
                  type="error"
                  description={errorMsg}
                  onClose={() => seterrorMsg(null)}
                  showIcon
                />
              )}
        {/* <Translate content="deposite_a_crypto" component={Title} className="text-white-30 fw-200 mb-8 custom-font mt-16" /> */}
       {!swapStore.isLoading && <>
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="text-white fw-500 fs-14 mt-16 mb-8 px-4 text-captz code-lbl" />
        <div className="dep-withdraw auto-scroll">
            <Spin spinning={loading}><CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.isLoading ? [] : swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} /></Spin>
        </div>
        </>
       }
        </>
}

export default ConnectStateProps(CryptoDeposit);