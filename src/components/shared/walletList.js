import React, { Component } from 'react';
import { Select, List,Empty, Image } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { Link ,} from "react-router-dom";
import Translate from "react-translate-component";
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
        if(this.props.buyInfo?.selectedWallet?.id){
            if (this.props.onWalletSelect) { this.props.onWalletSelect(this.props.buyInfo?.selectedWallet?.id) }
            this.setState({ ...this.state, selectedvalue: this.props.buyInfo?.selectedWallet?.id });
        }

    }
    render() {
        return (<>
            {this.props.buyInfo.memberFiat &&
                <form className="form" id="withdrawCurrency">
                    {/* <Select    getPopupContainer={() => document.getElementById('withdrawCurrency')} dropdownClassName="select-drpdwn" loading={this.props?.buyInfo?.memberFiat?.loading} placeholder={this.props.placeholder || apicalls.convertLocalLang("selectWallet")} className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={true}
                        value={this.props.selectedvalue ? this.props.selectedvalue : this.state.selectedvalue} 
                        onChange={(e) => {
                            
                            if (this.props.onWalletSelect) { this.props.onWalletSelect(e) }
                            this.setState({ ...this.state, selectedvalue: e });
                           // this.props.sendCurrency(e)      
                        }}>
                        {this.props.buyInfo.memberFiat?.data?.map((item, idx) =>
                            <Option key={idx} className="fw-400" value={item[this.props.valueFeild || 'id']}>{item.currencyCode}
                                {!this.props.hideBalance && <NumberFormat value={item.avilable} displayType={'text'} thousandSeparator={true} prefix={this.state.symbols[item.currencyCode]} renderText={(value, props) => <span {...props}> Balance: {value}</span>} />}
                            </Option>
                        )}
                    </Select> */}
                    <List
                    itemLayout="horizontal"
                    dataSource={this.props.buyInfo.memberFiat?.data}
                    className="crypto-list auto-scroll wallet-list selection-currency-list"
                    // loading={this.state.fiatWalletsLoading}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Translate content="No_data" />
                        } />
                    }}
                    renderItem={item => (

                        <List.Item
                        className={this.props.buyInfo?.selectedWallet?.currencyCode===item?.currencyCode?"select":""}
                         onClick={() => {
                            
                            if (this.props.onWalletSelect) { this.props.onWalletSelect(item.id) }
                            this.setState({ ...this.state, selectedvalue: item.id });
                           // this.props.sendCurrency(e)      
                        }}>
                            <Link>
                                <List.Item.Meta className='drawer-coin'
                                    avatar={<div className='crypto-bg'><span className='crypto-icon c-pointer ETH'></span></div>}

                                    title={<div className="wallet-title">{item.currencyCode}</div>}
                                />
                                <><div className="text-right coin-typo">
                                    <NumberFormat value={item.avilable} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={item.currencyCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
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
