import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List, Skeleton, Typography, Button } from 'antd';
import Translate from 'react-translate-component';
import chart from '../../assets/images/chart.png';

class Portfolio extends Component {
    state = {
        loading: false,
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { initLoading, loading } = this.state;
        const { crypto, crypto_value, crypto_usd, crypto_stock } = this.props;

        return (
            <div className="mb-24">
                <Translate content="Portfolio_title" component={Title} level={3} className="fs-24 fw-600 mb-0 text-white-30" />
                <div className="portfolio-count py-36 pb-0">
                    {/* <div className="d-flex align-center">
                        <span className="coin lg btc" />
                        <Paragraph className="text-white-30 fs-24 mb-0 ml-16 fw-500">{crypto}</Paragraph>
                    </div> */}
                    <div className="summary-count mr-16">
                        <Paragraph className="text-white-30 fs-40 m-0 fw-600" style={{ lineHeight: '54px' }}>${crypto_value}</Paragraph>
                        <Paragraph className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>{crypto_usd}</Paragraph>
                    </div>
                    <Button type="primary" className="trade-btn mt-16" size="small">{crypto_stock}<span className="icon sm downarrow-white ml-4" /></Button>
                </div>
                <img src={chart} width="100%" />
            </div>
        );
    }
}

export default Portfolio;