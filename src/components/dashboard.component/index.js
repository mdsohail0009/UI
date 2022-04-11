import React, { Component } from 'react';
import { Row, Col, Button, Carousel, Spin } from 'antd';
import Portfolio from './portfolio.component';
import MarketCap from './marketcap.component';
import AlertConfirmation from '../shared/alertconfirmation';
import { connect } from 'react-redux';
import { fetchNotices } from '../../reducers/dashboardReducer';
import Wallets from '../dashboard.component/wallets.component';
import YourPortfolio from '../dashboard.component/yourportfolio.component';
import apiCalls from '../../api/apiCalls';
import Notices from './notices';

class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
    };
    componentDidMount() {
        this.getNotices();
        this.dashboardTrack();
        //this.loginTrack();
    }

    dashboardTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Cockpit page view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Cockpit page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    getNotices = async () => {
        this.props.dispatch(fetchNotices(this.props.userProfileInfo.id))
    }
    render() {
        const { data: notices } = this.props.dashboard?.notices;
        return (
            <div className="main-container">
                {this.props.dashboard.notices.loading === false ? <Carousel className="docreq-slider" autoplay={true}>
                    {notices?.map((notice, idx) => <div key={idx}>
                        <AlertConfirmation type="error" title={notice.title} showIcon description="Our Compliance Team is requesting documents in line with your recent transaction, please click View Details. Thank you for your patience."
                            action={
                                <Button size="small" type="text" onClick={() => this.props.history.push(`/cases?id=${notice.typeId}`)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel> : ""}
                {!this.props?.userProfileInfo?.twofactorVerified && <div>
                    <AlertConfirmation type="error" title={"2FA"} showIcon description="Please enable two-factor authentication (2FA) in Security section. "
                        action={
                            <Button size="small" type="text" onClick={() => this.props.history.push(`/userprofile?key=2`)}>
                                Enable 2FA
                            </Button>
                        } />
                </div>}
                <Row justify="center mt-36">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <Wallets />
                        </div>
                        <div className="markets-panel">
                            <YourPortfolio />
                        </div>
                    </Col>
                    <Col xs={24} md={12} xl={14}>
                        <Portfolio
                            crypto="Bitcoin"
                            crypto_value='0.00'
                            crypto_usd="0.00 BTC"
                            crypto_stock="0.0%" />
                        {/* <Notices /> */}
                        <div className="markets-panel">
                            <MarketCap />
                        </div>
                    </Col>
                </Row>
            </div >
        );


    }
}
const mapStateToProps = ({ userConfig, dashboard }) => {
    return { userProfileInfo: userConfig.userProfileInfo, dashboard }
}
export default connect(mapStateToProps, (dispatch) => { return { dispatch } })(Home);