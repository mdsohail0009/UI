import React, { Component } from 'react';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import Wallets from './wallets.component';
import Translate from 'react-translate-component';
import Portfolio from './portfolio.component';
// import Coins from './coins.component';
import YourPortfolio from './yourportfolio.component';
import MarketCap from './marketcap.component';
import Notices from './notices';
import AlertConfirmation from '../shared/alertconfirmation';
import { connect } from 'react-redux';
import { getDashboardNotices } from '../documents.component/api';
const { Title, Paragraph } = Typography;
class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
    };
    componentDidMount() {
        this.fetchNotices();
    }
    fetchNotices = async () => {
        const response = await getDashboardNotices(this.props?.userProfileInfo.id);
        if (response.ok) {
            this.setState({ ...this.state, notices: response.data })
        }
    }
    render() {
        return (
            <div className="main-container">
                {this.state.notices != null && this.state.notices != undefined && <Carousel autoplay={true}>
                    {this.state.notices?.map((notice, idx) => <div className="mb-24" key={idx}>
                        <AlertConfirmation type="error" title={notice.title} showIcon description="Dear user please check the details for requesting documents to approval your deposit/withdraw."
                            action={
                                <Button size="small" type="text" onClick={() => this.props.history.push(`/documents/${notice.typeId}`)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel>}
                <Row justify="center">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <Wallets />
                        </div>
                        <div className="box markets-panel">
                            <div style={{ padding: '30px 24px 0' }}>
                                <Translate content="markets_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                                <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16 fw-200 mb-0" />
                            </div>
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

                        <Notices />
                        <YourPortfolio />
                        {/* <Coins /> */}
                    </Col>
                </Row>
            </div>
        );


    }
}
const mapStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo }
}
export default connect(mapStateToProps)(Home);