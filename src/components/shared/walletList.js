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
        this.props.getFiat(this.props.member?.id);
    }
    render() {
        return (<>
            {this.props.sellData.memberFiat &&
                <form className="form">
                    <Select loading={this.props?.sellData?.memberFiat?.loading} defaultValue="Select Wallet" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}
                        onChange={(e) => this.props.onWalletSelect ? this.props.onWalletSelect(e) : ""}>
                        {this.props.sellData.memberFiat?.data?.map((item, idx) =>
                            <Option key={idx} value={item.id}>{item.currencyCode+` Wallet Available:(${item.currencyCode} ${item.avilable})` }</Option>
                        )}
                    </Select>
                </form>
            }
        </>
        );
    }
}
const connectStateToProps = ({ buySell, sellData,userConfig }) => {
    return { buySell, sellData,member:userConfig?.userProfileInfo }
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
