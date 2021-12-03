import React, { Component } from 'react';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import success from '../../assets/images/success.png';
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
            "Type": 'User', "Action": 'Deposit fiat success page view', "Username": this.props.userConfig?.userName, "MemeberId": this.props.userConfig?.id, "Feature": 'Deposit Fiat', "Remarks": 'Deposit fiat success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Fiat'
        });
    }
    showPayCardDrawer = () => {
        console.log(this.state);
    }
    returnToFiatDep = () => {
        this.props.changeStep("step1");
        this.props.dispatch(setdepositCurrency(null));
    }

    render() {
        const { Paragraph } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={'success'} />
                    <div><Translate content="success_msg" component='Success' className="text-white-30 fs-36 fw-200 mb-4" /></div>
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_depositfiat" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.returnToFiatDep()} />
                    </Space>
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc, userConfig }) => {
    return { buySell, userConfig: userConfig.userProfileInfo }
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