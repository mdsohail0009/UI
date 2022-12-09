import React, { Component } from 'react';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import success from '../../assets/images/success.svg';
import { setdepositCurrency } from '../../reducers/depositReducer';
import apiCalls from "../../api/apiCalls";

class FaitdepositSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        this.fiatSummaryTrack();
    }
    fiatSummaryTrack = () => {
        apiCalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Fiat success page view', "Username": this.props.userConfig?.userName, "customerId": this.props.userConfig?.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit Fiat success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
        });
    }
    showPayCardDrawer = () => {
    }
    returnToFiatDep = () => {
        this.props.changeStep("step1");
        this.props.dispatch(setdepositCurrency(null));
    }
    render() {
        const { Paragraph, Title, Text } = Typography;
        const { depFiatSaveObj: fd } = this.props.depositInfo;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={'success'} />
                    <Translate content="success_msg" component={Title} className="" />
                    <Paragraph className=""><Translate content="sucessText1" component={Text} className="" /> {fd.Amount}{fd.currencyCode} <Translate content="sucessText2" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_depositfiat" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.returnToFiatDep()} />
                    </Space>
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, userConfig, depositInfo }) => {
    return { buySell, userConfig: userConfig.userProfileInfo, depositInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(FaitdepositSummary);