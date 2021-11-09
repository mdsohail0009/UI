import React, { Component } from 'react';
import { Typography, Button, Alert, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';
const LinkValue = (props) => {
    return (
        <Translate className="textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            onClick={() => window.open("https://www.iubenda.com/terms-and-conditions/42856099", '_blank')}
        />
    )
}
class Summary extends Component {
    render() {
        if (this.props?.loading) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { coin, oneCoinValue, amount, amountNativeCurrency, nativeCurrency, error, isButtonLoad, showFee, feeAmount, feeCurrency, okBtnTitle, showEstimatedTotal = true, showConvert = false, convertValue, convertCoin, showEstimated = true, exchangeCoin, decimalPlaces, onErrorClose, onCheked } = this.props;

        return (
            <>
                {!error?.valid && <Alert showIcon type="info" message={error?.title || apicalls.convertLocalLang('buy_crypto')} description={error?.message} closable onClose={() => onErrorClose ? onErrorClose() : ""} />}

                <div className="cryptosummary-container auto-scroll">
                    <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}><Currency prefix={""} decimalPlaces={decimalPlaces} defaultValue={amount} suffixText={coin} /> </div>
                    {showEstimated && <div className="text-white-50 fw-400 text-center fs-14 mb-16"><Currency defaultValue={amountNativeCurrency} prefix={""} decimalPlaces={decimalPlaces} type={'text'} prefixText={nativeCurrency} /></div>}
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                        <Currency defaultValue={oneCoinValue} decimalPlaces={decimalPlaces} prefix={""} className="fw-400 text-white-30" prefixText={`1 ${exchangeCoin || coin} = ${nativeCurrency}`}
                        />

                    </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="amount" component={Text} />
                        <Currency defaultValue={amount} decimalPlaces={decimalPlaces} prefix={""} type={'text'} className="fw-400 text-white-30"
                            prefixText={coin} />

                    </div>
                    {showFee && <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
                        <Currency defaultValue={feeAmount} prefix={""} className="text-darkgreen fw-400" prefixText={feeCurrency} />
                    </div>}
                    {showEstimatedTotal && <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
                        <Currency defaultValue={amountNativeCurrency} prefix={""} className="fw-400 text-white-30" prefixText={nativeCurrency} />

                    </div>}
                    {showConvert && <div className="pay-list fs-16 mb-16">
                        <Translate className="fw-400 text-white" content="convert" component={Text} />
                        <Currency defaultValue={convertValue} prefix={""} decimalPlaces={decimalPlaces} className="fw-400 text-white-30" suffixText={convertCoin} />
                    </div>}
                    <div className="fs-12 text-white-30 text-center my-16"><Translate className="fw-400 text-white" content="final_Amount" component={Text} /></div>
                    <div className="d-flex p-16 mb-36 agree-check">
                        <label>
                            <input type="checkbox" id="agree-check" checked={onCheked} onChange={({ currentTarget: { checked } }) => { this.props.onTermsChange(checked) }} />
                            <span for="agree-check" />
                        </label>
                        <Paragraph className="fs-14 text-white-30 ml-16 mb-0" style={{ flex: 1 }} >
                            <Translate content="agree_sell" component="Paragraph" />  <a className="textpure-yellow" href="https://www.iubenda.com/terms-and-conditions/42856099" target="_blank"><Translate content="terms" component="Text" /></a> <Translate content="refund_cancellation" component="Text" />
                        </Paragraph>
                    </div>
                    <SuisseBtn className={"pop-btn"} onRefresh={() => this.props.onRefresh()} title={okBtnTitle || "pay"} loading={isButtonLoad} autoDisable={true} onClick={() => this.props.onClick()} />
                    <div className="text-center mt-16">
                        <Translate content="cancel" component={Button} onClick={() => this.props.onCancel()} type="text" size="large" className="text-white-30 pop-cancel fw-400" />
                    </div>
                </div>

            </>
        )
    }
}
export default Summary;