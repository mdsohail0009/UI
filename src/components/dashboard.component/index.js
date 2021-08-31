import React, { Component } from 'react';
import { Row, Col, Typography} from 'antd';
import Wallets from './wallets.component';
import Translate from 'react-translate-component';
import Portfolio from './portfolio.component';
// import Coins from './coins.component';
import YourPortfolio from './yourportfolio.component';
import MarketCap from './marketcap.component';
import Notices from './notices';
const { Title, Paragraph } = Typography;
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
                {/* <div className="mb-24">
                    <AlertConfirmation />
                </div> */}
                <Row justify="center">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <Wallets />
                        </div>
                        <div className="box markets-panel">
                            <Translate content="markets_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                            <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16 fw-200 mb-0" />
                            {/* <Translate content="search_currency" component={Search} size="middle" bordered={false} enterButton className="mt-24" /> */}
                            <MarketCap />
                        </div>
                    </Col>
                    <Col xs={24} md={12} xl={14}>
                        <Portfolio
                            crypto="Bitcoin"
                            crypto_value='0.00'
                            crypto_usd="0.00 BTC"
                            crypto_stock="0.0%" />

                       <Notices/>
                        <YourPortfolio />
                        {/* <Coins /> */}
                    </Col>
                </Row>
            </div>
        );


    }
}

export default Home;