import React, { Component } from 'react';
import { Typography, Button, Tooltip, Checkbox, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { getSellPreviewData, savesellData } from '../../components/buysell.component/api'
import Loader from '../../Shared/loader'
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';
const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
class SellSummary extends Component {
    state = { sellpreviewData: {}, loader: true, disableConfirm: false, isTermsAgree: false, errorMessage: null }
    componentDidMount() {
        this.fetchPreviewData()
        setTimeout(() => this.setState({ ...this.state, disableConfirm: true }), 12000)
    }
    async fetchPreviewData() {
        let res = await getSellPreviewData(this.props.sellData.sellsaveObject);
        if (res.ok) {
            this.setState({ sellpreviewData: res.data, loader: false, disableConfirm: false })
        }
    }
    refreshPage() {
        this.fetchPreviewData()
    }
    async saveSellData() {
        this.setState({ ...this.state, errorMessage: '' })
        if (!this.state.isTermsAgree) {
            this.setState({ ...this.state, errorMessage: 'Please accept terms of service' })
            return;
        } else {
            this.setState({ ...this.state, loader: true, errorMessage: '' })
            let obj = Object.assign({}, this.props.sellData.sellsaveObject)
            obj.fromValue = this.state.sellpreviewData.amount
            obj.toValue = this.state.sellpreviewData.amountNativeCurrency
            obj.exicutedPrice = this.state.sellpreviewData.oneCoinValue
            obj.totalAmount = this.state.sellpreviewData.amountNativeCurrency + this.props.sellData.sellsaveObject.comission;
            let res = await savesellData(obj);
            if (res.ok) {
                this.props.changeStep('success')
                this.setState({ ...this.state, loader: false, disableConfirm: false })
            } else {
                this.setState({ ...this.state, loader: false, disableConfirm: false })
            }
        }
    }
    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        const { sellpreviewData } = this.state;
        return (
            <>
                {(!this.state.loader) && <>
                    {this.state?.errorMessage != null && this.state?.errorMessage != '' && <Alert closable={true} onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="info" message="Sell crypto" description={this.state?.errorMessage} />}
                    <NumberFormat value={sellpreviewData.amountNativeCurrency} displayType={'text'} thousandSeparator={true} renderText={(value, props) => <div {...props}> <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>USD {value}</div> </div>} />
                    <NumberFormat value={sellpreviewData.amount} displayType={'text'} thousandSeparator={true} renderText={(value, props) => <div {...props}><div className="text-white-50 fw-300 text-center fs-14 mb-16">{value} {sellpreviewData.coin}</div></div>} />
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                        <NumberFormat value={sellpreviewData.oneCoinValue} displayType={'text'} thousandSeparator={true} renderText={(value, props) => <div {...props}><div className="fw-300 text-white-30">1 {sellpreviewData.coin} = {value} USD</div></div>} />

                    </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="amount" component={Text} />
                        <NumberFormat value={sellpreviewData.amountNativeCurrency} displayType={'text'} thousandSeparator={true} renderText={(value, props) => <div {...props}> <div className="fw-300 text-white-30">USD {value}</div></div>} />

                    </div>
                    {/* <div className="pay-list fs-14">
                    <Text className="fw-400 text-white">Suissebase Fee<Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Text>
                    <Text className="text-darkgreen fw-400">USD $2.71</Text>
                </div> */}
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="total" component={Text} />
                        <Text className="fw-300 text-white-30">{sellpreviewData.amount} {sellpreviewData.coin} (USD {sellpreviewData.amountNativeCurrency})</Text>
                    </div>
                    <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} />
                    {/* <div className="text-center text-underline text-white"><Link className="text-yellow" onClick={() => this.refreshPage()}> Click to see the new rate.</Link></div> */}
                    <div className="d-flex p-16 mb-36 agree-check">
                        <label>
                            <input type="checkbox" id="agree-check" value={this.state.isTermsAgree} onChange={() => this.setState({ isTermsAgree: true })} />
                            <span for="agree-check" />
                        </label><Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                    </div>
                    <SuisseBtn autoDisable={true} className="pop-btn" onClick={() => this.saveSellData()} title="confirm_now" />
                    <Translate type="text" size="large" onClick={() => this.props.changeStep('step1')} className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" component={Button} />
                </>}
                {(this.state.loader) && <Loader />}
            </>
        )
    }
}

const connectStateToProps = ({ buySell, sellData }) => {
    return { buySell, sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

