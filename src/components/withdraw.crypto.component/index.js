import { Typography,  Spin } from "antd";
import { useEffect } from "react";
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setStep} from "../../reducers/sendreceiveReducer";
import Loader from '../../Shared/loader';
import CryptoList from '../shared/cryptolist';
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import { connect } from "react-redux";

const { Title } = Typography;
const WithdrawCrypto = ({ dispatch, userProfile, sendReceive, props, changeStep }) => {
    useEffect(() => {
        loadData();
        getFeaturePermissionsByKeyName(`send_crypto`)
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    const loadData = () => {
        dispatch(fetchWithDrawWallets({ customerId: userProfile?.id }));
        dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
    }
    const { cryptoWithdraw: { wallets } } = sendReceive;

    if (wallets?.loading) {
        return <Loader />
    }
   const handleCoinSelection = (wallet) => {
    dispatch(setSelectedWithDrawWallet(wallet)); 
    dispatch(setStep('withdraw_crypto_selected'))
    }
    return <>
        <div className="mt-8">
                    <div className='label-style'>Select An Asset To Send From Your Crypto Wallet</div>
                </div>
        <div className="dep-withdraw auto-scroll">
           
            <Spin spinning={wallets?.loading}><CryptoList showSearch={true} titleField={'coin'} iconField={'coin'} showValues={true} coinList={wallets?.loading ? [] : wallets?.data} isLoading={wallets?.loading} coinType={"swap"} onCoinSelected={(wallet) => handleCoinSelection(wallet)}/></Spin>
        </div>

    </>
}

const connectStateToProps = ({ sendReceive, userConfig,addressBookReducer }) => {
    return { addressBookReducer,sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
      
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
       
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawCrypto);
