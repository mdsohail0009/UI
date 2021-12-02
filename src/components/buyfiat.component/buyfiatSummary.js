import React, { Component } from 'react';
import { Typography, Button, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Currency from '../shared/number.formate';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { setdepositCurrency } from '../../reducers/depositReducer'
import apiCalls from "../../api/apiCalls";
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
        apiCalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Fiat Summary page view', "Username": this.props.userConfig.userName, "MemeberId": this.props.userConfig.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit Fiat Summary page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
        });
    }

    showSendReceiveDrawer = (value) => {
        this.props.changeStep("step1");
        //this.props.dispatch(setdepositCurrency(value));
    }

    render() {
        const { depositFiatData } = this.state;
        const { Text } = Typography;
        return (
            <>
                {!this.state.loading ? <div className="mt-36"><Spin /></div> : <div className="cryptosummary-container">

                    <div className="pay-list fs-14">
                        <Translate content="amount" component={Text} className="fw-400 text-white" />
                        <Currency className="fw-500 text-white-50" prefix={""} defaultValue={depositFiatData?.Amount} suffixText={depositFiatData?.currencyCode} />
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="bank_account_number" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.accountNumber}</Text>
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="Routing_number" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.routingNumber}</Text>
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="Swift_BICcode" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.networkCode}</Text>
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="Bank_name" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.BankName}</Text>
                    </div>
                    <ul className="pl-0 ml-16 text-white-50 mt-36">
                        <li><Translate className="pl-0 ml-0 text-white-50" content="account_details" component={Text} /> </li>
                        <li><Translate className="pl-0 ml-0 text-white-50" content="Cancel_select" component={Text} /></li>
                    </ul>
                    <Translate size="large" block className="pop-btn mt-36" content="confirm" component={Button} onClick={() => this.props.changeStep('step3')} />
                    <div className="text-center mt-8">
                        <Translate content="back" component={Button} type="text" size="large" onClick={() => this.showSendReceiveDrawer(depositFiatData?.currencyCode)} className=" pop-cancel fw-400" />
                    </div></div>}
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

