import React, { Component } from 'react';
import { Typography, List, Button } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
//import MassPayment from '../../components/buyfiat.component'
import SuissebaseFiat from '../../components/buyfiat.component/suissebaseFiat';

const { Title, Paragraph } = Typography;
const suisseWalletList = [
    {
        title: 'usd',
        coin: 'usd-d',
        price: '$ 0.00',
    },
    {
        title: 'eur',
        coin: 'EUR',
        price: '€ 0.00',
    },
    {
        title: 'gbp',
        coin: 'gbp',
        price: '£ 0.00',
    },
]

class SuissebaseWallet extends Component {
    state = {
        sendReceiveDrawer: false,
        valNum: 1
    }
    showSendReceiveDrawer = (e) => {
        this.setState({
            valNum: e
        }, () => {
            this.setState({
                sendReceiveDrawer: true
            })
        })
    }
    closeDrawer = () => {
        this.setState({
            sendReceiveDrawer: false
        })
    }
    render() {
        return (
            <>
                <Translate content="suissebase_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                <Translate content="suissebase_subtitle" component={Paragraph} className="text-white-30 fs-16 mb-16 fw-200" />
                <List
                    itemLayout="horizontal"
                    dataSource={suisseWalletList}
                    bordered={false}
                    className="mx-24 mobile-list"
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0">{item.title}</div>}
                                description={<Paragraph className="fs-16 text-white-30 fw-200 m-0" style={{ lineHeight: '12px' }}>{item.price}</Paragraph>}
                            />
                            <div className="crypto-btns">
                                <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => this.showSendReceiveDrawer(2)} component={Button} className="custom-btn sec ml-16" />
                            </div>
                        </List.Item>}
                />
                <SuissebaseFiat showDrawer={this.state.sendReceiveDrawer} valNum={this.state.valNum} onClose={() => this.closeDrawer()} />

            </>
        );
    }
}

export default SuissebaseWallet;