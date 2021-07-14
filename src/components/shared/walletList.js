import React, { Component } from 'react';
import { List,Select } from 'antd';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
const { Option } = Select;
class WalletList extends Component {
    state = {
        isArrow: true,
    }
    render() {
        return (
            <form className="form">
            <Select defaultValue="Select Currency" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}>
                <Option value="US Dollar">US Dollar</Option>
                <Option value="Euro">Euro</Option>
                <Option value="Pound Sterlling">Pound Sterlling</Option>
             </Select> 
             </form>
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
export default connect(connectStateToProps, connectDispatchToProps)(WalletList);
