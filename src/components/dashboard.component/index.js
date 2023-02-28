
import React, { Component } from 'react';
import { Row, Col, Button, Carousel,Typography, } from 'antd';
import Portfolio from './portfolio.component';
import MarketCap from './marketcap.component';
import AlertConfirmation from '../shared/alertconfirmation';
import { connect } from 'react-redux';
import { fetchNotices } from '../../reducers/dashboardReducer';
import Translate from 'react-translate-component';
import Wallets from '../dashboard.component/wallets.component';
import YourPortfolio from '../dashboard.component/yourportfolio.component';
import apiCalls from '../../api/apiCalls';
import Notices from './notices';
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import BankWallets from '../bankui.component'
import SbCard from './sbCard';
import { getScreenName } from '../../reducers/feturesReducer';
const { Title } = Typography;
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
        this.props.dispatch(getScreenName({ getScreen: "dashboard" }));
    }
    loadPermissions = () => {
        if (this.props.cockpitPermissions) {
            clearInterval(this.permissionsInterval);
            let _permissions = {};
            for (let action of this.props.cockpitPermissions?.actions) {
                _permissions[action.permissionName] = action.values;
            }
            this.setState({ ...this.state, permissions: _permissions });
            if(_permissions.view!==true){
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
            <div className="main-container dashbord-space case-carsl">
                {this.props?.twoFA && ((!this.props?.twoFA?.isEnabled) && (!this.props?.twoFA?.loading)) && <div>
                    <AlertConfirmation type="error" title={"2FA"} showIcon description="Please enable two-factor authentication (2FA) by clicking on user profile in the top right hand corner and navigating to “Manage Your Account” > “Security” or by clicking on Enable 2FA."
                        action={
                            <Button size="small" type="text" onClick={() => this.props.history.push(`/userprofile/2`)}>
                                Enable 2FA
                            </Button>
                        } />
                </div>}
                {this.props.dashboard.notices.loading === false ? <Carousel className="docreq-slider" autoplay={true}>
                    {notices?.map((notice, idx) => <div key={idx} className="notify-alerticon">
                        <AlertConfirmation type="error" title={notice.title} showIcon description="Our Compliance Team is requesting documents in line with your recent transaction, Please click View Details. Thank you for your patience."
                            action={
                                <Button className='notify-viewbtn' size="small" type="text" onClick={() => this.props.history.push(`/caseView/${notice.typeId}`)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel> : ""}
            <div className='d-flex align-center'>
                <Translate content="Dashboard" component={Title} className="db-main-title" />
                <span className='acount-type'>{this.props.userProfileInfo?.isBusiness==true?"Business":"Personal"}</span>
            </div>
            {this.state.permissions.Notices && <Notices />}
                <Row justify="center mt-16" gutter={[16,16]}>
                <Col xs={24} md={12} xl={15} lg={15} xxl={15} className="db-flex-style">
                        
                        {this.state.permissions?.Balances &&<>
                            <div className="markets-panel">
                                <YourPortfolio />
                            </div>
                        
                            <div className="markets-panel markets-line">    
                                <Wallets />
                            </div>                     
                        </>}
                        {this.state.permissions.Transactions && <Portfolio
                            crypto="Bitcoin"
                            crypto_value='0.00'
                            crypto_usd="0.00 BTC"
                            crypto_stock="0.0%" />}
                        
                    </Col>
                    <Col xs={24} md={12} lg={9} xl={9} className="cust-col-design">
                        <SbCard />
                        {this.state.permissions?.Bank &&  <div className='marketcap-mt'>
                       <BankWallets/> 
                       </div>}
                       
                        {this.state.permissions.Markets && 
                            <MarketCap />
                       }
                       
                    </Col>
                </Row>
            </div >
        );


    }
}
const mapStateToProps = ({ userConfig, dashboard, menuItems }) => {
    return { userProfileInfo: userConfig.userProfileInfo, dashboard, twoFA: userConfig.twoFA, cockpitPermissions: menuItems?.featurePermissions?.cockpit,menuItems }
}
export default connect(mapStateToProps, (dispatch) => { return { dispatch } })(Home);