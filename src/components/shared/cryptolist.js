import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List, Skeleton, Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import apiCalls from '../../api/apiCalls'
import SelectCrypto from '../sell.component/selectCrypto';
import connectStateProps from '../../utils/state.connect';

class CryptoList extends Component {
    state = {
        loading: false,
        initLoading: true, coinsList: []
    }
    componentDidMount() {
        this.loadCryptos();
    }
    loadCryptos = async () => {
        let res = await apiCalls.getCryptos()
        this.setState({ coinsList: res.data })
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
    render() {
        const { Title, Paragraph } = Typography
        const { initLoading, loading } = this.state;
        const loadMore =
            !loading ? (
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
            <List
                itemLayout="horizontal"
                dataSource={this.state.coinsList}
                loadMore={loadMore}
                className="crypto-list"
                renderItem={item => (
                    <List.Item>
                        <Link onClick={() => this.props.dispatch(setStep("step2"))}>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.walletCode} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.walletCode}</div>}
                            />
                            <div className="text-right coin-typo">
                                <div className="text-white-30 fw-600">${item.transactionFee}</div>
                                <div className={item.up ? 'text-red' : 'text-green'}>-{item.percent_change_1h} % </div>
                            </div>
                            {!item.up ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}
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
            </Drawer></>
        );
    }
}

export default connectStateProps(CryptoList);