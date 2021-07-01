import React, { Component } from 'react';
import { Row, Col, Typography, List, Button, Skeleton, Input, Carousel, Drawer, Dropdown } from 'antd';
import { CaretDownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import chart from '../../assets/images/chart.png'
import graph from '../../assets/images/graph.png'
import { Link } from 'react-router-dom';
import { AudioOutlined } from '@ant-design/icons';
import config from '../../config/config';
import SuissebaseWallet from '../shared/suissebasewallet';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import Portfolio from '../shared/portfolio';
import Coins from '../shared/coins';
import YourPortfolio from '../shared/yourportfolio';

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;

class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
    };
    render() {
        return (
            <div className="main-container">
                <Row justify="center">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <SuissebaseWallet />
                        </div>
                        <div className="box markets-panel">
                            <Translate content="markets_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                            <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16 fw-200" />
                            <Search placeholder="Search Currency" size="middle" bordered={false} enterButton className="mt-24" />
                            <CryptoList />
                        </div>
                    </Col>
                    <Col xs={24} md={12} xl={14}>
                        <Portfolio
                            crypto="Bitcoin"
                            crypto_value='60,000.00'
                            crypto_usd="1.0147658 BTC"
                            crypto_stock="7.41%" />

                        <Carousel autoplay className="mb-24">
                            <div className="p-28 carousel-card">
                                <Translate content="db_slider_title" component={Title} className="fs-24 text-black mb-4" />
                                <Translate content="db_slider_desc" component={Paragraph} className="fs-16 text-black mb-24" />
                                <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime mb-24" />
                            </div>
                            <div className="p-28 carousel-card">
                                <Translate content="db_slider_title" component={Title} className="fs-24 text-black mb-4" />
                                <Translate content="db_slider_desc" component={Paragraph} className="fs-16 text-black mb-24" />
                                <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime mb-24" />
                            </div>
                            <div className="p-28 carousel-card">
                                <Translate content="db_slider_title" component={Title} className="fs-24 text-black mb-4" />
                                <Translate content="db_slider_desc" component={Paragraph} className="fs-16 text-black mb-24" />
                                <Translate content="db_slider_btn" component={Button} type="primary" className="custom-btn fs-14 prime mb-24" />
                            </div>
                        </Carousel>
                        <YourPortfolio />
                        <Coins />
                    </Col>
                </Row>
            </div>
        );


    }
}

export default Home;