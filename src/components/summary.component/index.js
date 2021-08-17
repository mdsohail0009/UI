import React, { Component } from 'react';
import { Typography, Button, Alert, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import Currency from '../shared/number.formate';
const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
class Summary extends Component {
    render() {
        if (this.props?.loading) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { coin, oneCoinValue, amount, amountNativeCurrency, nativeCurrency, error, isButtonLoad, showFee, feeAmount, feeCurrency, okBtnTitle, showEstimatedTotal = true, showConvert = false, convertValue, convertCoin,showEstimated = true,exchangeCoin, decimalPlaces, currencyPrefix } = this.props;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
                {!error?.valid && <Alert showIcon type="info" message="Buy crypto" description={error?.message} closable onClose={() => this.setState({ ...this.state, error: { valid: true, message: null } })} />}
                <div className="cryptosummary-container auto-scroll">
                    <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}><Currency prefix={""} defaultValue={amount} suffixText={coin} /> </div>
                    {showEstimated && <div className="text-white-50 fw-300 text-center fs-14 mb-16"><Currency defaultValue={amountNativeCurrency} type={'text'} prefixText={nativeCurrency} /></div>}
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                        <Currency defaultValue={oneCoinValue} prefix={currencyPrefix} className="fw-300 text-white-30" prefixText={`1 ${exchangeCoin||coin} = ${nativeCurrency}`}
                        />

                    </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="amount" component={Text} />
                        <Currency defaultValue={amount} prefix={currencyPrefix} type={'text'} className="fw-300 text-white-30"
                            prefixText={coin} />

                    </div>
                    {showFee && <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
                        <Currency defaultValue={feeAmount} className="text-darkgreen fw-400" prefixText={feeCurrency} />
                    </div>}
                    {showEstimatedTotal && <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
                        <Currency defaultValue={amountNativeCurrency} decimalPlaces={"3"} className="fw-300 text-white-30" prefixText={nativeCurrency}/>

                    </div>}
                    {showConvert && <div className="pay-list fs-16 mb-16">
                        <Translate className="fw-400 text-white" content="convert" component={Text} />
                        {/* <Text className="fw-300 text-white-30">{this.props.swapStore.fromCoinInputValue} {this.props.swapStore?.coinDetailData?.coin} </Text> */}
                        <Currency defaultValue={convertValue} className="fw-300 text-white-30" suffixText={convertCoin} />
                    </div>}
                    <div className="fs-12 text-white-30 text-center my-16">Your final amount might be changed with in
                        10 seconds.</div>
                    <div className="d-flex p-16 mb-36 agree-check">
                        <label>
                            <input type="checkbox" id="agree-check" onChange={({ currentTarget: { checked } }) => { this.props.onTermsChange(checked) }} />
                            <span for="agree-check" />
                        </label>
                        <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16 mb-0" style={{ flex: 1 }} />
                    </div>
                    <SuisseBtn className={"pop-btn"} onRefresh={() => this.props.onRefresh()} title={okBtnTitle || "pay"} loading={isButtonLoad} autoDisable={true} onClick={() => this.props.onClick()} />
                    <Translate content="cancel" component={Button} onClick={() => this.props.onCancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
                </div>

            </>
        )
    }
}
export default Summary;