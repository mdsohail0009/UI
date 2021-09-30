import { Card, Typography } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setStep, setSubTitle } from "../../reducers/sendreceiveReducer";
import connectStateProps from "../../utils/state.connect";
import Currency from '../shared/number.formate';
import Loader from '../../Shared/loader';

const { Paragraph, Text, Title } = Typography;
const WithdrawCrypto = ({ dispatch, userProfile, sendReceive }) => {
    useEffect(() => {
        loadData()
    }, [])
    const loadData = () =>{
        dispatch(fetchWithDrawWallets({ memberId: userProfile?.id }));
        dispatch(handleSendFetch({key:"cryptoWithdraw",activeTab:null}));
        dispatch(setSubTitle("Select a currency in your wallet"));
    }
    const { cryptoWithdraw: { wallets } } = sendReceive;

    if (wallets?.loading) {
        return <Loader />
    }
    return <>
        <Translate content="withdraw_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
        <Translate content="withdraw_a_crypto_text" component={Paragraph} className="fs-16 text-secondary" />
        <div className="dep-withdraw auto-scroll">
            {wallets?.data?.map((wallet, indx) => <Card key={indx} className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { dispatch(setSelectedWithDrawWallet(wallet)); dispatch(setStep('step2')) }} >
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

export default connectStateProps(WithdrawCrypto);