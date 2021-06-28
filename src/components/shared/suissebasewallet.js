import React, { Component } from 'react';
import { Typography, List, Button } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';

const { Title, Paragraph } = Typography;
const suisseWalletList = [
    {
        title: 'usd',
        coin: 'usd-d',
        price: '$ 5,000',
    },
    {
        title: 'eur',
        coin: 'eur',
        price: '€ 2,500',
    },
    {
        title: 'gbp',
        coin: 'gbp',
        price: '£ 2,500',
    },
]

class SuissebaseWallet extends Component {
    state = {}
    render() {
        return (
            <>
                <Translate content="suissebase_title" component={Title} className="fs-24 fw-700 mb-0 text-white-30" />
                <Translate content="suissebase_subtitle" component={Paragraph} className="text-white-30 fs-16" />
                <List
                    itemLayout="horizontal"
                    dataSource={suisseWalletList}
                    bordered={false}
                    renderItem={item =>
                        <List.Item className="py-8">
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0">{item.title}</div>}
                                description={<Paragraph className="fs-16 text-white-30 fw-200 m-0" style={{ lineHeight: '12px' }}>{item.price}</Paragraph>}
                            />
                            <div className="text-right">
                                <Translate content="deposit" component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" component={Button} className="custom-btn sec ml-12" />
                            </div>
                        </List.Item>}
                />

            </>
        );
    }
}

export default SuissebaseWallet;