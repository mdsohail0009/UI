import React, { Component } from 'react';
import { Row, Col, Button, Carousel } from 'antd';
import Portfolio from './portfolio.component';
import MarketCap from './marketcap.component';
import AlertConfirmation from '../shared/alertconfirmation';
import { connect } from 'react-redux';
import { fetchNotices } from '../../reducers/dashboardReducer';
import Wallets from '../dashboard.component/wallets.component';
import YourPortfolio from '../dashboard.component/yourportfolio.component';
import apiCalls from '../../api/apiCalls';
import Notices from './notices';
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import BankWallets from '../bankui.component'

class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
        permissions: {}
    };
    permissionsInterval;
    componentDidMount() {
        getFeaturePermissionsByKeyName(`cockpit`)
        this.getNotices();
        this.dashboardTrack();
        this.permissionsInterval = setInterval(this.loadPermissions, 200);
    }
    loadPermissions = () => {
        if (this.props.cockpitPermissions) {
            clearInterval(this.permissionsInterval);
            let _permissions = {};
            for (let action of this.props.cockpitPermissions?.actions) {
                _permissions[action.permissionName] = action.values;
            }
            this.setState({ ...this.state, permissions: _permissions });
            if(_permissions.view!=true){
                this.props.history.push(`/accessdenied`)
            }
        }
    }
    dashboardTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Cockpit page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Cockpit page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    getNotices = async () => {
        this.props.dispatch(fetchNotices(this.props.userProfileInfo.id))
    }
    render() {
        const { data: notices } = this.props.dashboard?.notices;
        return (
            <div className="main-container">
                {this.props?.twoFA && ((!this.props?.twoFA?.isEnabled) && (!this.props?.twoFA?.loading)) && <div>
                    <AlertConfirmation type="error" title={"2FA"} showIcon description="Please enable two-factor authentication (2FA) by clicking on user profile in the top right hand corner and navigating to “Manage Your Account” > “Security” or by clicking on Enable 2FA."
                        action={
                            <Button size="small" type="text" onClick={() => this.props.history.push(`/userprofile/2`)}>
                                Enable 2FA
                            </Button>
                        } />
                </div>}
                {this.props.dashboard.notices.loading === false ? <Carousel className="docreq-slider" autoplay={true}>
                    {notices?.map((notice, idx) => <div key={idx}>
                        <AlertConfirmation type="error" title={notice.title} showIcon description="Our Compliance Team is requesting documents in line with your recent transaction, Please click View Details. Thank you for your patience."
                            action={
                                <Button size="small" type="text" onClick={() => this.props.history.push(`/cases?id=${notice.typeId}`)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel> : ""}

                <Row justify="center mt-16">
                {this.state.permissions?.Balances && <Col xs={24} md={12} xl={10}>
                    <div className="markets-panel">
                        <BankWallets/>
                    </div>
                        <div className="markets-panel mb-16 markets-line">
                            <Wallets />
                        </div>
                        <div className="markets-panel">
                            <YourPortfolio />
                        </div>
                    </Col>}
                    <Col xs={24} md={12} xl={14}>
                        {this.state.permissions.Transactions && <Portfolio
                            crypto="Bitcoin"
                            crypto_value='0.00'
                            crypto_usd="0.00 BTC"
                            crypto_stock="0.0%" />}
                        {this.state.permissions.Notices && <Notices />}
                        {this.state.permissions.Markets && <div className="markets-panel mr-0">
                            <MarketCap />
                        </div>}
                    </Col>
                </Row>
            </div >
        );


    }
}
const mapStateToProps = ({ userConfig, dashboard, menuItems }) => {
    return { userProfileInfo: userConfig.userProfileInfo, dashboard, twoFA: userConfig.twoFA, cockpitPermissions: menuItems?.featurePermissions?.cockpit }
}
export default connect(mapStateToProps, (dispatch) => { return { dispatch } })(Home);