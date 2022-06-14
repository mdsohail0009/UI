import { Card, Typography, Empty,Image } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setStep, setSubTitle } from "../../reducers/sendreceiveReducer";
import ConnectStateProps from "../../utils/state.connect";
import Currency from '../shared/number.formate';
import Loader from '../../Shared/loader';
import apicalls from "../../api/apiCalls";

const { Paragraph, Text } = Typography;
const WithdrawCrypto = ({ dispatch, userProfile, sendReceive }) => {
    useEffect(() => {
        loadData();
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    const loadData = () => {
        dispatch(fetchWithDrawWallets({ memberId: userProfile?.id }));
        dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
        dispatch(setSubTitle(apicalls.convertLocalLang("selectCurrencyinWallet")));
    }
    const { cryptoWithdraw: { wallets } } = sendReceive;

    if (wallets?.loading) {
        return <Loader />
    }
    return <>
        <Translate content="withdraw_a_crypto_text" component={Paragraph} className="text-white-30 fw-300 fs-16 mt-16" />
        <div className="dep-withdraw auto-scroll">
            {wallets?.data.length ? <>{wallets?.data?.map((wallet, indx) => <Card key={indx} className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { dispatch(setSelectedWithDrawWallet(wallet)); dispatch(setStep('withdraw_crypto_selected')) }} >
                <span className="d-flex align-center">
                    <Image preview={false} src={wallet.impageWhitePath}/>
                    <Text className="fs-24 text-purewhite ml-8">{wallet.coinFullName}</Text>
                </span>
                <div className="crypto-details">
                    <div className="crypto-percent">{wallet.percentage}<sup className="percent">%</sup></div>
                    <div className="crypto-amount">
                        <Currency defaultValue={wallet.coinBalance} prefix={""} type={"text"} suffixText={wallet.coin} />
                        <Currency defaultValue={wallet.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                    </div>
                </div>
            </Card>)}</> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apicalls.convertLocalLang('No_data')} />}
        </div>

    </>
}

export default ConnectStateProps(WithdrawCrypto);