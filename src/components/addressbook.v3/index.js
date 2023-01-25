import React, { Component } from "react";
import FiatAddress from "../addressbook.component/fiat.address";
import SelectCrypto from "../addressbook.component/selectCrypto";
import { List, Empty, Image } from 'antd';
import { Link } from "react-router-dom";
import Translate from "react-translate-component";
import { fetchMemberWallets } from '../dashboard.component/api'
import ConnectStateProps from "../../utils/state.connect";
import NumberFormat from "react-number-format";
import Loader from "../../Shared/loader";
class AddressBookV3 extends Component {
    state = {
        currency: this.props.selectedAddress?.currency || null,
        fiatWallets: [],
        fiatWalletsLoading: true
    }
    componentDidMount() {
        this.setState({ ...this.state, fiatWalletsLoading: true });
        fetchMemberWallets().then(res => {
            if (res.ok) {
                this.setState({ ...this.state, fiatWallets: res.data, fiatWalletsLoading: false });
            } else {
                this.setState({ ...this.state, fiatWallets: [], fiatWalletsLoading: false });
            }
        });
    }
    fiatHeading =(data)=>{
        this.props?.isFiatHeadUpdate(data);
	}
    render() {
        if (!this.state.currency) {
            return <React.Fragment>
                {this.state.fiatWalletsLoading && <Loader />}
                {!this.state.fiatWalletsLoading &&
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.fiatWallets}
                    className="crypto-list auto-scroll wallet-list"
                    locale={{
                        emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
                            <Translate content="No_data" />
                        } />
                    }}
                    renderItem={item => (

                        <List.Item onClick={() => this.setState({ ...this.state, currency: item.walletCode })}>
                            <Link>
                                <List.Item.Meta className='drawer-coin'
                                    avatar={<Image preview={false} src={item.imagePath} />}

                                    title={<div className="wallet-title">{item.walletCode}</div>}
                                />
                                <><div className="text-right coin-typo">
                                    <NumberFormat value={item.amount} className="drawer-list-font" displayType={'text'} thousandSeparator={true} prefix={item.walletCode == 'USD' ? '$' : '€'} renderText={(value, props) => <div {...props} >{value}</div>} />

                                </div></>
                            </Link>
                        </List.Item>
                    )}
                />
                    }
            </React.Fragment>
        }
        else if (this.props.isFiat)
            return <FiatAddress selectedAddress={this.props.selectedAddress} currency={this.state.currency} onAddressOptionsChange={() => { }} type={this.props.type} onContinue={this.props?.onContinue} fiatHeadingUpdate={this.fiatHeading}/>
        else
            return <SelectCrypto />
    }
}
export default ConnectStateProps(AddressBookV3)