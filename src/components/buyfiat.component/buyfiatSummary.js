import React, { Component } from 'react';
import { Typography, Button, Spin } from 'antd';
import Currency from '../shared/number.formate';
import { setStep, } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { setFiatFinalRes } from '../../reducers/depositReducer'
import { savedepositFiat } from '../deposit.component/api';
import apiCalls from "../../api/apiCalls";


class FiatSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            depositFiatData: null,
            getDepFiatSaveData: {},
            loading: true,
            btnDisabled: false
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state, depositFiatData: this.props.depositInfo?.depFiatSaveObj, getDepFiatSaveData: this.props.depositInfo?.setDepFiatSaveObj
        })
        apiCalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Fiat summary page view', "Username": this.props.userConfig.userName, "customerId": this.props.userConfig.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit Fiat summary page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
        });
    }

    showSendReceiveDrawer = (value) => {
        this.props.changeStep("step1");
    }

    saveDepFiat = async (values) => {
        this.setState({ btnDisabled: true });
        let Obj = Object.assign({}, this.props.depositInfo?.setDepFiatSaveObj);
        Obj.currency = apiCalls.encryptValue(Obj.currency, this.props.userConfig?.sk)
        Obj.bankName = apiCalls.encryptValue(Obj.bankName, this.props.userConfig?.sk)
        Obj.reference = apiCalls.encryptValue(Obj.reference, this.props.userConfig?.sk)
        Obj.routingNumber = apiCalls.encryptValue(Obj.routingNumber, this.props.userConfig?.sk)
        Obj.swiftorBICCode = apiCalls.encryptValue(Obj.swiftorBICCode, this.props.userConfig?.sk)
        Obj.benficiaryBankName = apiCalls.encryptValue(Obj.benficiaryBankName, this.props.userConfig?.sk)
        Obj.benficiaryAccountAddrress = apiCalls.encryptValue(Obj.benficiaryAccountAddrress, this.props.userConfig?.sk)
        Obj.accountNumber = apiCalls.encryptValue(Obj.accountNumber, this.props.userConfig.sk)
        Obj.bankAddress = apiCalls.encryptValue(Obj.bankAddress, this.props.userConfig.sk)

        Obj.info = JSON.stringify(this.props.trackAuditLogData);
        let response = await savedepositFiat(Obj);
        if (response.ok === true) {
            this.setState({ btnDisabled: false });
            this.props.dispatch(setFiatFinalRes(response.data));
            this.props.changeStep('step3')
        }
    }
    render() {
        const { depositFiatData, btnDisabled } = this.state;
        const { Text } = Typography;
        return (
            <>
                {(!this.state.loading && depositFiatData == null) ? <div className="mt-36"><Spin /></div> : <div className="cryptosummary-container">
                    <div className="pay-list fs-14">
                        <Translate content="amount" component={Text} className="fw-400 text-white" />
                        <Currency className="fw-500 text-white-50" prefix={""} defaultValue={depositFiatData?.Amount} suffixText={depositFiatData?.currencyCode} />
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="bank_account_number" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.accountNumber}</Text>
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="Swift_BICcode" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.networkCode}</Text>
                    </div>
                    <div className="pay-list fs-14">
                        <Translate content="Bank_name" component={Text} className="fw-400 text-white" />
                        <Text className="fw-500 text-white-50">{depositFiatData?.bankName}</Text>
                    </div>
                    <ul className="pl-0 ml-16 text-white-50 mt-36">
                        <li><Translate className="pl-0 ml-0 text-white-50" content="account_details" component={Text} /> </li>
                        <li><Translate className="pl-0 ml-0 text-white-50" content="Cancel_select" component={Text} /></li>
                    </ul>
                    <Translate size="large" block className="pop-btn mt-36" content="deposit" component={Button} onClick={this.saveDepFiat} disabled={btnDisabled} />
                    <div className="text-center mt-8">
                        <Translate content="back" component={Button} type="text" size="large" onClick={() => this.showSendReceiveDrawer(depositFiatData?.currencyCode)} className=" pop-cancel fw-400" />
                    </div></div>}
            </>
        )
    }
}
const connectStateToProps = ({ userConfig, depositInfo }) => {
    return { userConfig: userConfig.userProfileInfo, depositInfo, trackAuditLogData: userConfig.trackAuditLogData }
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

