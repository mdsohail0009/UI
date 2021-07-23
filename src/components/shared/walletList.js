import React, { Component } from 'react';
import { Select } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchMemberFiat } from '../buysell.component/crypto.reducer';
const { Option } = Select;
class WalletList extends Component {
    state = {
        isArrow: true,
    }
    componentDidMount() {
        this.props.getFiat();
    }
    render() {
        return (<>
            {this.props.sellData.memberFiat &&
                <form className="form">
                    <Select defaultValue="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}
                        onChange={(e) => this.props.onWalletSelect ? this.props.onWalletSelect(e) : ""}>
                        {this.props.sellData.memberFiat?.data?.map((item, idx) =>
                            <Option key={idx} value={item.id}>{item.bankName}</Option>
                        )}
                    </Select>
                </form>
            }
        </>
        );
    }
}
const connectStateToProps = ({ buySell, sellData }) => {
    return { buySell, sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        getFiat: () => dispatch(fetchMemberFiat())
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WalletList);
