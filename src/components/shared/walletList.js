import React, { Component } from 'react';
import { Select } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchMemberFiat } from '../buysell.component/crypto.reducer';
import NumberFormat from 'react-number-format';

const { Option } = Select;
class WalletList extends Component {
    state = {
        isArrow: true,
    }
    componentDidMount() {
        this.props.getFiat(this.props.member?.id);
    }
    render() {
        return (<>
            {this.props.sellData.memberFiat &&
                <form className="form">
                    <Select dropdownClassName="select-drpdwn" loading={this.props?.sellData?.memberFiat?.loading} placeholder="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}
                        onChange={(e) => this.props.onWalletSelect ? this.props.onWalletSelect(e) : ""}>
                        {this.props.sellData.memberFiat?.data?.map((item, idx) =>
                            <Option key={idx} value={item.id}>{item.currencyCode}
                            <NumberFormat value={item.avilable} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <span {...props}> Balance: {value}</span>} />
                            </Option>
                        )}
                    </Select>
                </form>
            }
        </>
        );
    }
}
const connectStateToProps = ({ buySell, sellData, userConfig }) => {
    return { buySell, sellData, member: userConfig?.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        getFiat: (id) => dispatch(fetchMemberFiat(id))
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WalletList);
