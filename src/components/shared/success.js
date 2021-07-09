import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Drawer, Typography, Button, Card, Input, Tooltip, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

const LinkValue = (props) => {
    return (
      <Translate className="f-16 text-white-30 mt-16 text-underline"
        content={props.content}
        component={Link}
        to="./#"
      />
    )
  }
class SuccessMsg extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        const link = <LinkValue content="return_to_buy_sell" />;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                    <Space direction="vertical" size="large">
                    <Translate with={{link}} component={Link} onClick={() => this.props.changeStep("step1")}/>
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
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
