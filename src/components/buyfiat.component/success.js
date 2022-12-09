import React, { Component } from 'react';
import success from '../../assets/images/success.svg';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class SuccessMsg extends Component {
    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={'success'} />
                    <Translate content="success_msg" component={Title} className="" />
                    <Translate content="success_decr" component={Paragraph} className="" />
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_fiat" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.props.changeStep("step1")} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);
