import React, { Component } from 'react';
import success from '../../assets/images/success.svg';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep, getMemberCoins, updateSwapdata, clearSwapData } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import apiCalls from '../../api/apiCalls';

class SuccessMessage extends Component {
    componentDidMount() {
        apiCalls.trackEvent({
            "Type": 'User', "Action": ' Swap success page view', "Username": this.props.userProfile?.userName, "customerId": this.props.userProfile?.userId, "Feature": 'Swap', "Remarks": 'Swap success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Swap'
        });
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { swapFinalRes: sd } = this.props.swapStore;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="" />
                    <Paragraph className=""><Translate content="sucessText1" component={Text} className="" />{" "} {sd.tovalue} {" "} {sd.toWalletCode} <Translate content="sucessText2" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                    <Space direction="vertical" size="large">
                        <Link onClick={() => {
                            this.props.dispatch(updateSwapdata({
                                fromCoin: null,
                                receiveCoin: null,
                                price: null,
                                fromValue: null,
                                receiveValue: null,
                                errorMessage: null
                            })); this.props.clearSwapfullData(); this.props.dispatch(setStep("swapcoins"));
                        }}><Translate content="Back_to_Swap" component={Link} className="f-16 text-white-30 mt-16 text-underline" /></Link>
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ swapStore, userConfig }) => {
    return { swapStore, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        fetchMemberCoins: (customer_id) => {
            dispatch(getMemberCoins(customer_id))
        },
        clearSwapfullData: (customer_id) => {
            dispatch(clearSwapData(customer_id))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMessage);