import { Card, Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setStep, setSubTitle } from "../../reducers/sendreceiveReducer";
import ConnectStateProps from "../../utils/state.connect";
import Currency from '../shared/number.formate';
import Loader from '../../Shared/loader';
import apicalls from "../../api/apiCalls";

const { Paragraph, Text, Title } = Typography;
const WithdrawCrypto = ({ dispatch, userProfile, sendReceive }) => {
    useEffect(() => {
        loadData()
    }, [])
    const loadData = () => {
        dispatch(fetchWithDrawWallets({ memberId: userProfile?.id }));
        dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
        dispatch(setSubTitle(apicalls.convertLocalLang("selectCurrencyinWallet")));
        trackevent()
    }
    const trackevent = () => {
        apicalls.trackEvent({
        "Type": 'User', "Action": 'Page view', "Username": userProfile.userName, "MemeberId": userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto' 
        });
    }
    const { cryptoWithdraw: { wallets } } = sendReceive;

    if (wallets?.loading) {
        return <Loader />
    }
    return <>
        <Translate content="withdraw_a_crypto" component={Title} className="text-white-30 fw-200 mb-8 mt-16 custom-font" />
        <Translate content="withdraw_a_crypto_text" component={Paragraph} className="fs-16 text-secondary" />
        <div className="dep-withdraw auto-scroll">
            {wallets?.data?.map((wallet, indx) => <Card key={indx} className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { dispatch(setSelectedWithDrawWallet(wallet)); dispatch(setStep('withdraw_crypto_selected')) }} >
                <span className="d-flex align-center">
                    <span className={`coin lg ${wallet.coin}`} />
                    <Text className="fs-24 text-purewhite ml-8">{wallet.coinFullName}</Text>
                </span>
                <div className="crypto-details">
                    <div className="crypto-percent">{wallet.percentage}<sup className="percent">%</sup></div>
                    <div className="crypto-amount">
                        <Currency defaultValue={wallet.coinBalance} prefix={""} type={"text"} suffixText={wallet.coin} />
                        <Currency defaultValue={wallet.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                    </div>
                </div>
            </Card>)}

        </div>

    </>
}

export default ConnectStateProps(WithdrawCrypto);