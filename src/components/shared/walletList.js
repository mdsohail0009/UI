import React, { Component } from 'react';
import { Select, List, Empty, Image } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { Link, } from "react-router-dom";
import Translate from "react-translate-component";
import { connect } from 'react-redux';
import { fetchMemberFiat } from '../../reducers/buyReducer';
import NumberFormat from 'react-number-format'


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
        this.props.getFiat(this.props.member?.id, () => {
            if (this.props.buyInfo?.memberFiat?.data[0]?.id) {
                if (this.props.onWalletSelect) { this.props.onWalletSelect(this.props.buyInfo?.memberFiat?.data[0]?.id) }
                this.setState({ ...this.state, selectedvalue: this.props.buyInfo?.memberFiat?.data[0]?.id });
            }
        });


    }
    render() {
        return (<>
            {this.props.buyInfo.memberFiat &&
                <form className="form" id="withdrawCurrency">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.props.buyInfo.memberFiat?.data}
                        className="crypto-list auto-scroll wallet-list selection-currency-list"
                        locale={{
                            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                                <Translate content="No_data" />
                            } />
                        }}
                        renderItem={item => (

                            <List.Item
                                className={(this.props.buyInfo?.selectedWallet?.currencyCode === item?.currencyCode || this.props.buyInfo?.selectedWallet?.toWalletCode === item?.currencyCode) ? "select" : ""}
                                onClick={() => {

                                    const isSameCurrency = this.props.buyInfo?.selectedWallet?.currencyCode === item?.currencyCode || this.props.buyInfo?.selectedWallet?.toWalletCode === item?.currencyCode ;
                                    if (this.props.onWalletSelect && !isSameCurrency) { this.props.onWalletSelect(item.id) }
                                    this.setState({ ...this.state, selectedvalue: item.id });
                                }}>


                                <Link>
                                    <List.Item.Meta
                                        avatar={<Image preview={false} src={item.imagePath} />}

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
        getFiat: (id, callback) => dispatch(fetchMemberFiat(id, callback))
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WalletList);
