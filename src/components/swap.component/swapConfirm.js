import React, { Component } from 'react';
import confirm from '../../assets/images/confirm.png';
import { Typography } from 'antd';
import Translate from 'react-translate-component';
import SuccessMsg from './success';
const { Title } = Typography;
class SwapConfirm extends Component {
    state = {
        success: false,
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ success: true })
        }, 4000)
    }
    render() {
        return (
            <>
                {!this.state.success ? <div className="success-pop text-center confitm-pop">
                    <img src={confirm} className="confirm-icon" />
                    <Translate content="confirm_msg" component={Title} className="" />
                </div> :
                    <SuccessMsg />
                }
            </>
        );
    }
}

export default SwapConfirm;