import { Typography, Alert, Spin } from "antd";
import React, { useState,useEffect } from "react";
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
       getFeaturePermissionsByKeyName(`send_crypto`)}, []);//eslint-disable-line react-hooks/exhaustive-deps
    const [errorMsg,seterrorMsg] = useState(null)
    const [loading,setLoading] = useState(null)
    const useDivRef = React.useRef(null);
    const fetchMemberCoins = () => {
        dispatch(getMemberCoins());
    }
    const onCryptoCoinSelect = async (coin) => {
      useDivRef.current?.scrollIntoView(0,0);
        setLoading(true)
        const response = await createCryptoDeposit({ customerId: userProfile?.id, walletCode: coin?.coin, network: coin?.netWork });
        if (response.ok) {
            dispatch(setWalletAddress(response.data));
            dispatch(fetchDashboardcalls(userProfile?.id));
            dispatch(setStep("step7"));
            useDivRef.current?.scrollIntoView(0,0);
            dispatch(setSubTitle(` ${coin.coin}` +" " + "balance" +" "+ ":" +" "+ `${coin.coinBalance ? coin.coinBalance : '0'}`+`${" "}`+`${coin.coin}`));
        }else{
            seterrorMsg(isErrorDispaly(response))
            useDivRef.current?.scrollIntoView(0,0);
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
        <div ref={useDivRef}>
    {swapStore.isLoading && <Loader />}
    {errorMsg !== null && (
                <Alert
                  type="error"
                  description={errorMsg}
                  onClose={() => seterrorMsg(null)}
                  showIcon
                />
              )}
       {!swapStore.isLoading && <>
        <Translate content="deposite_a_cryto_txt" component={Paragraph} className="label-style" />
        <div className="dep-withdraw auto-scroll">
            <Spin spinning={loading}><CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={swapStore.isLoading ? [] : swapStore.MemberCoins} isLoading={swapStore.isLoading} onCoinSelected={(coin) => onCryptoCoinSelect(coin)} coinType={"swap"} /></Spin>
        </div>
        </>
       }
       </div>
        </>
}

export default ConnectStateProps(CryptoDeposit);