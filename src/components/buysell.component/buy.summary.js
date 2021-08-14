import React, { Component } from 'react';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchPreview } from './crypto.reducer';
import { buyCrypto } from './api';
import Summary from '../summary.component';
import Loader from '../../Shared/loader';
class BuySummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            disablePay: false,
            error: { valid: true, error: null },
            isTermsAgreed:false
        }
    }
    componentDidMount() {

    }

    pay = async () => {
        this.setState({ ...this.state, error: { valid: true, message: null } });
        if (this.state.isTermsAgreed) {
            const { id: toWalletId, walletName: toWalletName, walletCode: toWalletCode } = this.props.sellData?.coinWallet;
            const { id: fromWalletId, bankName: fromWalletName, currencyCode: fromWalletCode } = this.props.sellData?.selectedWallet;
            const obj = {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "membershipId": this.props?.member?.id,
                fromWalletId,
                fromWalletCode,
                fromWalletName,
                "fromValue": this.props.sellData.previewDetails?.data?.amountNativeCurrency,
                toWalletId,
                toWalletCode,
                toWalletName,
                "toValue": this.props.sellData.previewDetails?.data?.amount,
                "description": "Buy Crypto",
                "comission": 0,
                "exicutedPrice": 0,
                "totalAmount": this.props.sellData.previewDetails?.data?.amount

            }
            this.setState({ isLoading: true });
            const response = await buyCrypto(obj);
            if (response.ok) {
                this.props.changeStep('success')
            } else {
                this.setState({ ...this.state, error: { valid: false, message: response.data || response.originalError.message } })
            }
            this.setState({ isLoading: false })
        } else {
            this.setState({ ...this.state, error: { valid: false, message: "Please agree to terms & conditions" } })
        }
    }
    render() {
        if (this.props.sellData?.previewDetails?.loading || !this.props.sellData?.previewDetails?.data) {
            return <Loader />
        }
        const { coin, oneCoinValue, amount, amountNativeCurrency } = this.props.sellData?.previewDetails?.data;
        return <Summary
            loading={this.props.sellData?.previewDetails?.loading || !this.props.sellData?.previewDetails?.data}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={this.props.sellData?.selectedWallet?.currencyCode}
            error={this.state.error} iButtonLoad={this.state.isLoading}
            onRefresh={() => this.props.refreshDetails(this.props.sellData?.selectedWallet, coin, amount)}
            onCancel={() => this.props.changeStep('step1')}
            onClick={() => this.pay()}
            onTermsChange={(checked)=>{this.setState({...this.state,isTermsAgreed:checked})}}
        />
        // return (
        //     <>
        //         {!this.state?.error?.valid && <Alert showIcon type="info" message="Buy crypto" description={this.state.error?.message} closable onClose={() => this.setState({ ...this.state, error: { valid: true, message: null } })} />}
        //         <div className="cryptosummary-container auto-scroll">
        //             <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}><Currency prefix={""} defaultValue={amount} suffixText={coin} /> </div>
        //             <div className="text-white-50 fw-300 text-center fs-14 mb-16"><Currency defaultValue={amountNativeCurrency} type={'text'} prefixText={this.props.sellData?.selectedWallet?.currencyCode} /></div>
        //             <div className="pay-list fs-14">
        //                 <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
        //                 <Currency defaultValue={oneCoinValue} className="fw-300 text-white-30" prefixText={`1 ${coin} = ${this.props.sellData?.selectedWallet?.currencyCode}`}
        //                 />

        //             </div>
        //             <div className="pay-list fs-14">
        //                 <Translate className="fw-400 text-white" content="amount" component={Text} />
        //                 <Currency defaultValue={amount} type={'text'} className="fw-300 text-white-30"
        //                     prefixText={coin} />

        //             </div>
        //             {/* <div className="pay-list fs-14">
        //             <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
        //             <Text className="text-darkgreen fw-400">USD 0,000</Text>
        //         </div> */}
        //             <div className="pay-list fs-14">
        //                 <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
        //                 <Currency defaultValue={amountNativeCurrency} className="fw-300 text-white-30" prefixText={this.props.sellData?.selectedWallet?.currencyCode} />

        //             </div>
        //             {/* <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} /> */}
        //             <div className="fs-12 text-white-30 text-center my-16">Your final amount might be changed with in
        //                 {/* {seconds}  */}
        //                 10 seconds.</div>
        //             {/* <div className="text-center text-underline text-white"><Link onClick={() => { this.startCounter(); this.setState({ ...this.state, disablePay: false }) }} className="text-yellow">Click to see the new rate.</Link></div> */}
        //             <div className="d-flex p-16 mb-36 agree-check">
        //                 <label>
        //                     <input type="checkbox" id="agree-check" />
        //                     <span for="agree-check" />
        //                 </label>
        //                 <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16 mb-0" style={{ flex: 1 }} />
        //             </div>
        //             <SuisseBtn className={"pop-btn"} onRefresh={() => this.props.refreshDetails(this.props.sellData?.selectedWallet, coin, amount)} title={"pay"} loading={this.state.isLoading} autoDisable={true} onClick={() => this.pay()} />
        //             <Translate content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
        //         </div>

        //     </>
        // )
    }
}
const connectStateToProps = ({ buySell, oidc, sellData, userConfig }) => {
    return { buySell, sellData, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        refreshDetails: (wallet, coin, amount) => {
            dispatch(fetchPreview({ coin, wallet, amount }))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BuySummary);