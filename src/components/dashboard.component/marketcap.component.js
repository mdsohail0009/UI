import { Table } from 'antd';
import React, { Component } from 'react';
import Loader from '../../Shared/loader';
import Currency from '../shared/number.formate';
import { fetchMarketCaps } from './api';

class MarketCap extends Component {
    columns = [{ title: "Coin", dataIndex: "name" },
    { title: "", dataIndex: "symbol" },
    {
        title: "Price", dataIndex: "current_price", render: (val) => <Currency defaultValue={val} type={"text"} />
    },
    {title:""}
    ]
    state = {
        marketCaps: [],
        isLoading: false
    }
    componentDidMount() {
        this.fetchMarketCapsInfo();
    }
    async fetchMarketCapsInfo() {
        this.setState({ ...this.state, isLoading: true });
        const response = await fetchMarketCaps({ pageNo: 1 });
        if (response.ok) {
            this.setState({ ...this.state, marketCaps: response.data, isLoading: false });
        }
    }
    render() {
        const { isLoading, marketCaps } = this.state;
        if (isLoading) { return <Loader /> }
        return <Table columns={this.columns} dataSource={marketCaps} loading={isLoading} />
    }
}
export default MarketCap;