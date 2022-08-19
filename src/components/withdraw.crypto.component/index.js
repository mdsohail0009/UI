import { Card, Typography, Empty,Image } from "antd";
import { useEffect } from "react";
import Translate from "react-translate-component";
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setStep, setSubTitle } from "../../reducers/sendreceiveReducer";
import ConnectStateProps from "../../utils/state.connect";
import Currency from '../shared/number.formate';
import Loader from '../../Shared/loader';
import apicalls from "../../api/apiCalls";
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'

const { Paragraph, Text } = Typography;
const WithdrawCrypto = ({ dispatch, userProfile, sendReceive }) => {
    useEffect(() => {
        loadData();
        getFeaturePermissionsByKeyName(`sendreceivecrypto`)
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    const loadData = () => {
        dispatch(fetchWithDrawWallets({ customerId: userProfile?.id }));
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
                
                <div className="crypto-details d-flex">
                    <div>
                    <span className="d-flex align-center mb-4">
                    <Image preview={false} src={wallet.impageWhitePath}/>
                    <div className="crypto-percent">{wallet.percentage}<sup className="percent">%</sup></div>
                    
                </span> 
                
                <Text className="fs-24 text-purewhite ml-4 mt-8">{wallet.coinFullName}</Text>
                    </div>
                    <div>
                    <div className="crypto-amount">
                        <Currency defaultValue={wallet.coinBalance} prefix={""} type={"text"} suffixText={wallet.coin} />
                        <Currency defaultValue={wallet.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                    </div>
                </div></div>
            </Card>)}</> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apicalls.convertLocalLang('No_data')} />}
        </div>

    </>
}

export default ConnectStateProps(WithdrawCrypto);