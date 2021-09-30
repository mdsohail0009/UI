import React, { Component } from 'react';
import { Row, Col, Typography, Button, Carousel } from 'antd';
import Wallets from './wallets.component';
import Translate from 'react-translate-component';
import Portfolio from './portfolio.component';
import YourPortfolio from './yourportfolio.component';
import MarketCap from './marketcap.component';
import Notices from './notices';
import AlertConfirmation from '../shared/alertconfirmation';
import { connect } from 'react-redux';
import { fetchNotices } from '../../reducers/dashboardReducer';
const { Title, Paragraph } = Typography;
class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
    };
    componentDidMount() {
        this.getNotices();
    }
    getNotices = async () => {
       this.props.dispatch(fetchNotices(this.props.userProfileInfo.id))
    }
    render() {
        const { data: notices } = this.props.dashboard?.notices;
        return (
            <div className="main-container">
                {notices !== null && notices !== undefined && <Carousel className="docreq-slider" autoplay={true}>
                    {notices?.map((notice, idx) => <div className="mb-24" key={idx}>
                        <AlertConfirmation type="error" title={notice.title} showIcon description="Dear user please check the details for requesting documents to approval your deposit/withdraw."
                            action={
                                <Button size="small" type="text" onClick={() => this.props.history.push(`/documents?id=${notice.typeId}`)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel>}
                <Row justify="center mt-36">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <Wallets />
                        </div>
                        <div className="box markets-panel">
                            <div style={{ padding: '30px 24px 0' }}>
                                <Translate content="markets_title" component={Title} className="fs-24 fw-600 mb-0 text-white-30" />
                                <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16 fw-200 mb-0" />
                            </div>
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
                    </Col>
                </Row>
            </div>
        );


    }
}
const mapStateToProps = ({ userConfig,dashboard }) => {
    return { userProfileInfo: userConfig.userProfileInfo,dashboard }
}
export default connect(mapStateToProps, (dispatch) => { return {dispatch} })(Home);