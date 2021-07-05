import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import sacnner from '../../assets/images/sacnner.png';
import Translate from 'react-translate-component';

class ScanQR extends Component {
    state = {}
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <div>
                <div className="scanner-img">
                    <img src={sacnner} />
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="cancel" component={Button} onClick={() => this.props.changeStep('step4')} />
            </div>
        )
    }
}

const connectStateToProps = ({ sendReceive, oidc }) => {
    return { sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(ScanQR);