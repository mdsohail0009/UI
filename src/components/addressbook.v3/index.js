import React, { Component } from "react";
import FiatAddress from "../addressbook.component/fiat.address";
import SelectCrypto from "../addressbook.component/selectCrypto";
import { List, Empty, Image } from 'antd';
import { Link } from "react-router-dom";
import Translate from "react-translate-component";
import { fetchMemberWallets } from '../dashboard.component/api'
import ConnectStateProps from "../../utils/state.connect";
import NumberFormat from "react-number-format";
class AddressBookV3 extends Component {
    state = {
        currency: this.props.selectedAddress?.currency || null,
        fiatWallets: [],
        fiatWalletsLoading: true
    }
    componentDidMount() {
        this.setState({ ...this.state, fiatWalletsLoading: true });
        fetchMemberWallets(this.props?.userProfile?.id).then(res => {
            if (res.ok) {
                this.setState({ ...this.state, fiatWallets: res.data, fiatWalletsLoading: false });
            } else {
                this.setState({ ...this.state, fiatWallets: [], fiatWalletsLoading: false });
            }
        });
    }
    render() {
        if (!this.state.currency) {
            return <React.Fragment>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.fiatWallets}
                    className="crypto-list auto-scroll wallet-list"
                    loading={this.state.fiatWalletsLoading}
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Translate content="No_data" />
                        } />
                    }}
                    renderItem={item => (

                        <List.Item onClick={() => this.setState({ ...this.state, currency: item.walletCode })}>
                            <Link>
                                <List.Item.Meta
                                    avatar={<Image preview={false} src={item.imagePath} />}

                                    title={<div className="wallet-title">{item.walletCode}</div>}
                                />
                                <><div className="text-right coin-typo">
                                    <NumberFormat value={item.amount} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
            </React.Fragment>
        }
        else if (this.props.isFiat)
            return <FiatAddress selectedAddress={this.props.selectedAddress} currency={this.state.currency} onAddressOptionsChange={() => { }} type={this.props.type} onContinue={this.props?.onContinue} />
        else
            return <SelectCrypto />
    }
}
export default ConnectStateProps(AddressBookV3)