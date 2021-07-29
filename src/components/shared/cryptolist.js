import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, Drawer, Typography, Input, Empty } from 'antd';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import SelectCrypto from '../sell.component/selectCrypto';
import connectStateProps from '../../utils/state.connect';
import { fetchCoins } from '../buysell.component/crypto.reducer';
import NumberFormat from 'react-number-format';

class CryptoList extends Component {
    state = {
        loading: false,
        initLoading: true, coinsList: null,

    }
    componentDidMount() {
        this.props.dispatch(fetchCoins(this.props.coinType || "all"));
    }
    renderContent = () => {
        return <SelectCrypto />
    }
    showBuyDrawer = () => {
        this.setState({
            showDrawer: true
        })
    }
    closeDrawer = () => {
        this.setState({
            showDrawer: false,
        })
    }
    handleSearch = (value) => {
        let coinsList;
        if (!value) {
            coinsList = this.props.sellData?.coins[this.props.coinType]?.data;
        } else {
            coinsList = this.props.sellData?.coins[this.props.coinType]?.data.filter(item => item.walletCode.toLowerCase().includes(value.toLowerCase()));
        }
        this.setState({ ...this.state, coinsList })
    }
    render() {
        const { Paragraph } = Typography;
        const { Search } = Input;
        const loadMore =
            !this.props.sellData?.coins[this.props.coinType]?.loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 16,
                        height: 40,
                        lineHeight: '40px',
                        borderColor: 'var(--borderGrey)'
                    }}
                >
                    <Translate content="load_more" component={Link} className="fs-16 text-white-30" />
                </div>
            ) : null;
        return (<>
            <Search placeholder="Search Currency" onChange={({ currentTarget }) => { this.handleSearch(currentTarget.value) }} size="middle" bordered={false} enterButton className="my-16" />
            <List
                itemLayout="horizontal"
                dataSource={this.state.coinsList || this.props.sellData?.coins[this.props.coinType]?.data}
                //loadMore={loadMore}
                className="crypto-list auto-scroll"
                loading={this.props.sellData?.coins[this.props.coinType]?.loading}
                locale={{ emptyText:<Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={<span>No records found</span>} />}}
                renderItem={item => (
                    <List.Item>
                        <Link onClick={() => { this.props.isShowDrawer ? this.showBuyDrawer() : (this.props.onCoinSelected ? this.props.onCoinSelected(item) : this.props.dispatch(setStep("step2"))) }}>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.walletCode} mr-4`} />}
                                title={<div className="wallet-title">{item.walletCode}</div>}
                            />
                            <div className="text-right coin-typo">
                                <NumberFormat value={item.amountInUSD} className="text-white-30 fw-600" displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} className="text-white-30 fw-600">{value}</div>} />
                                <div className={item.percent_change_1h < 0 ? 'text-red' : 'text-green'}>{item.percent_change_1h} % </div>
                            </div>
                            {item.percent_change_1h > 0 ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}
                        </Link>
                    </List.Item>
                )}
            />
            <Drawer
                title={[<div className="side-drawer-header">
                    <span onClick={() => this.closeDrawer()} className="icon md lftarw-white c-pointer" />
                    <div className="text-center fs-14 px-16">
                        <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Buy DOT</Paragraph>
                        <Paragraph className="text-white-50 mb-0 fw-300 swap-subtitlte" ></Paragraph></div>
                    <span className="icon md close-white c-pointer" onClick={() => this.closeDrawer()} /></div>]}
                placement="right"
                closable={true}
                visible={this.state.showDrawer}
                closeIcon={null}
                className="side-drawer"
            >
                {this.renderContent()}
            </Drawer>
        </>
        );
    }
}

export default connectStateProps(CryptoList);