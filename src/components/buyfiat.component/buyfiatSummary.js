import React, { Component, useState } from 'react';
import { Typography, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Currency from '../shared/number.formate';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'

const LinkValue = (props) => {
    return (
        <Translate className="textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            onClick={() => window.open("https://www.iubenda.com/terms-and-conditions/42856099", '_blank')}
        />
    )
}

class FiatSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            depositFiatData: {},
            loading: true,
        }
    }

    componentDidMount() {
        this.setState({ ...this.state, depositFiatData: this.props.depositInfo?.depFiatSaveObj })
    }

    showSendReceiveDrawer = (value) => {
        this.props.changeStep("step1");
        this.props.dispatch(setdepositCurrency(value));
    }

    render() {
        const { depositFiatData } = this.state;
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
                {!this.state.loading ? <div className="mt-36"><Spin /></div> : <><Text className="fs-14 text-white-50 fw-200"> <Translate content="amount" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
                    <Currency className="fs-20 text-white-30 mb-36" prefix={""} defaultValue={depositFiatData?.Amount} suffixText={depositFiatData?.currencyCode} />
                    <Text className="fs-14 text-white-50 fw-200"> <Translate content="Bank_account" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
                    <Text className="fs-20 text-white-30 d-block mb-36">{depositFiatData?.accountNumber}</Text>
                    <Text className="fs-14 text-white-50 fw-200"><Translate content="BIC_SWIFT_routing_number" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
                    <Text className="fs-20 text-white-30 d-block mb-36">{depositFiatData?.routingNumber}</Text>
                    <Text className="fs-14 text-white-50 fw-200"><Translate content="Bank_name" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
                    <Text className="fs-20 text-white-30 d-block mb-36">{depositFiatData?.BankName}</Text>
                    <Text className="fs-14 text-white-50 fw-200"><Translate content="Recipient_full_name" component={Text} className="fs-14 text-white-50 fw-200" /></Text>
                    <Text className="fs-20 text-white-30 d-block mb-36">{depositFiatData?.accountName}</Text>
                    <ul className="pl-0 ml-16 text-white-50 mt-36">
                        <li><Translate className="pl-0 ml-0 text-white-50" content="account_details" component={Text} /> </li>
                        <li><Translate className="pl-0 ml-0 text-white-50" content="Cancel_select" component={Text} /></li>
                    </ul>
                    <Translate size="large" block className="pop-btn mt-36" content="confirm" component={Button} onClick={() => this.props.changeStep('step3')} />
                    <div className="text-center mt-8">
                        <Translate content="back" component={Button} type="text" size="large" onClick={() => this.showSendReceiveDrawer(depositFiatData?.currencyCode)} className=" pop-cancel fw-400" />
                    </div></>}
            </>
        )
    }
}
const connectStateToProps = ({ userConfig, depositInfo }) => {
    return { userConfig: userConfig.userProfileInfo, depositInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(FiatSummary);

