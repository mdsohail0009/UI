import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography,Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep, getMemberCoins,updateSwapdata, clearSwapData } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SuccessMessage extends Component {
    render() {
        const { Title } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon"  alt={"success"}/>
                    <Translate className="text-white-30 fs-36 fw-200 mb-4" content="transaction_submitted" component={Title} />
                    <Space direction="vertical" size="large">
                        <Link onClick={() => {this.props.dispatch(updateSwapdata({
                                fromCoin: null,
                                receiveCoin: null,
                                price: null,
                                fromValue: null,
                                receiveValue: null,
                                errorMessage: null
                            })); this.props.dispatch(setStep("step1"));this.props.clearSwapfullData()
                        }} className="f-16 text-white-30 mt-16 text-underline"><Translate content="Back_to_Swap" component={Link} className="f-16 text-white-30 mt-16 text-underline"/><span className="icon md diag-arrow ml-4" /></Link>
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
        fetchMemberCoins: (member_id) => {
            dispatch(getMemberCoins(member_id))
        },
        clearSwapfullData: (member_id) => {
            dispatch(clearSwapData(member_id))
        },
        dispatch
    }
}
export default connect(connectStateToProps,connectDispatchToProps)(SuccessMessage);