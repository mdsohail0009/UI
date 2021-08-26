import React, { Component } from 'react';
import { List, Button, Typography } from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import connectStateProps from '../../utils/state.connect';
import { fetchYourPortfolio } from './api';
import Currency from '../shared/number.formate';

class YourPortfolio extends Component {
    state = {
        loading: true,
        initLoading: true,
        portfolioData: [], buyDrawer: false
    }
    componentDidMount() {
        this.loadCryptos();
    }
    loadCryptos = async () => {
        if (this.props.userProfile) {
            let res = await fetchYourPortfolio(this.props.userProfile.id)
            if (res.ok) this.setState({ portfolioData: res.data,loading:false })
        }
    }
    showBuyDrawer = () => {
        this.setState({
            buyDrawer: true
        })
    }
    closeDrawer = () => {
        this.setState({
            buyDrawer: false,
        })
    }
    render() {
        const { Title } = Typography;
        return (
            <div className="box portfolio-list">
                <Translate content="your_portfolio" component={Title} className="fs-24 text-white mb-36 mt-0 fw-600" />
                <List className="mobile-list"
                    itemLayout="horizontal"
                    dataSource={this.state.portfolioData}
                    loading={this.state.loading}
                    renderItem={item => (
                        <List.Item className="" extra={
                            <div className="crypto_btns">
                                <Translate content="buy" component={Button} type="primary" onClick={() => this.showBuyDrawer()} className="custom-btn prime" />
                                <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" onClick={() => this.showBuyDrawer()} />
                            </div>
                        }>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<div className="fs-18 fw-300 text-upper text-white mb-0 mt-12">{item.coin}</div>}
                            />

                            <div className={`text-right fs-20 ${item.coinBalance>0 ? 'text-green' : 'text-red'}`}><Currency defaultValue={item.coinBalance} type={"text"}/></div>
                            {/* {item.coinBalance>0? <span className="icon md gain mr-8" /> : <span className="icon md lose mr-8" />} */}
                            {/* <div className="fs-16 text-white-30 fw-300 ml-24  text-upper ">{item.totalcoin} {item.shortcode}</div> */}
                        </List.Item>
                    )}
                />
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
            </div>
        );
    }
}

export default connectStateProps(YourPortfolio);
