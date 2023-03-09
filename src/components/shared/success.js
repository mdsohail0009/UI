import React, { Component } from 'react';
import success from '../../assets/images/success.svg';
import { Typography, Button } from 'antd';
import Translate from 'react-translate-component';
import { setStep, setSellHeaderHide, setSelectedSellCoin } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';

class SuccessMsg extends Component {
    componentDidMount() {
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Buy Crypto success', "Username": this.props.member.userName, "customerId": this.props.member.id, "Feature": 'Buy', "Remarks": 'Buy Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
    }
    onBuyCancel = () => {
        this.props.dispatch(setSellHeaderHide(false));
        this.props.dispatch(setSelectedSellCoin(true));
        this.props.changeStep("step1")
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { buyFinalRes: bd } = this.props.buyInfo;
        return (
            <>
            <div className='custom-declaraton'>
                <div className="success-pop text-center declaration-content">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="success-title" />
                    <Paragraph className="successsubtext"><Translate content="sucessText1" component={Text} className="successsubtext" /> {bd.tovalue} {bd.toWalletCode} <Translate content="sucessText2" className="successsubtext" component={Text} /></Paragraph>
                        <Translate content="return_to_buy" component={Button} onClick={() => this.onBuyCancel()}  size="large"className="cust-cancel-btn"/>
                </div>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell, userConfig, buyInfo }) => {
    return { buySell, member: userConfig.userProfileInfo, buyInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch,
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);
