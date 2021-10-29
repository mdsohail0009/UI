import React, { Component } from 'react';
import { Select } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchMemberFiat } from '../../reducers/buyReducer';
import NumberFormat from 'react-number-format'
import apicalls from '../../api/apiCalls';

const { Option } = Select;
class WalletList extends Component {
    state = {
        isArrow: true,
        selectedvalue: null,
        symbols: {
            "EUR": "€",
            "USD": "$",
            "GBP": "£"
        }
    }
    componentDidMount() {
        this.props.getFiat(this.props.member?.id);
    }
    render() {
        return (<>
            {this.props.buyInfo.memberFiat &&
                <form className="form" id="withdrawCurrency">
                       <Select getPopupContainer={() => document.getElementById('withdrawCurrency')} dropdownClassName="select-drpdwn" loading={this.props?.buyInfo?.memberFiat?.loading} placeholder={this.props.placeholder || apicalls.convertLocalLang("selectWallet")} className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                       value={this.props.selectedvalue ? this.props.selectedvalue : this.state.selectedvalue} onChange={(e) => {
                            if (this.props.onWalletSelect) { this.props.onWalletSelect(e) }
                            this.setState({ ...this.state, selectedvalue: e });
                        }}>
                        {this.props.buyInfo.memberFiat?.data?.map((item, idx) =>
                            <Option key={idx} value={item[this.props.valueFeild || 'id']}>{item.currencyCode}
                                {!this.props.hideBalance && <NumberFormat value={item.avilable} displayType={'text'} thousandSeparator={true} prefix={this.state.symbols[item.currencyCode]} renderText={(value, props) => <span {...props}> Balance: {value}</span>} />}
                            </Option>
                        )}
                    </Select>
                </form>
            }
        </>
        );
    }
}
const connectStateToProps = ({ buySell, buyInfo, userConfig }) => {
    return { buySell, buyInfo, member: userConfig?.userProfileInfo }
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
