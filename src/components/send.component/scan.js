import React, { Component } from 'react';
import { Button } from 'antd';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class ScanQR extends Component {
    state = {}
    render() {
        return (
            <div>
                <div className="scanner-img">
                    {/* <img src={sacnner} /> */}
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="close" component={Button} onClick={() => this.props.changeStep('step4')} />
            </div>
        )
    }
}

const connectStateToProps = ({ sendReceive }) => {
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