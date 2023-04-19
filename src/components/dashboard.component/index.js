
import React, { Component } from 'react';
import { Row, Col, Button, Carousel,Typography,Drawer } from 'antd';
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
import AddressCrypto from "../addressbook.component/addressCrypto";
import {Link } from "react-router-dom";
import {
	rejectCoin,
	clearValues,
	clearCryptoValues,
} from '../../reducers/addressBookReducer';
import { getScreenName } from '../../reducers/feturesReducer';

const { Title,Paragraph } = Typography;
class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        childrenDrawer: false,
        permissions: {},
        hideFiatHeading:false,
        beneficiaryDetails:false,
        cryptoFiat:false,
        cryptoId:"",
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
    goToDetails=(data)=>{
        if(data.isReqforDoc)
        {
            this.props.history.push(`/caseView/${data.typeId}`)
        }else{
            this.setState({...this.state,hideFiatHeading:false,beneficiaryDetails:true,cryptoId:data.docTypeId})
        }
       
    }
    closeCryptoDrawer=()=>{
		this.setState({ ...this.state, beneficiaryDetails: false, selectedObj: {} });
        this.props.dispatch(rejectCoin());
		this.props.dispatch(clearValues());
		this.props.dispatch(clearCryptoValues());
		
	}
    headingChange=(data)=>{
		this.setState({...this.state,hideFiatHeading:data})
	}
    render() {
        const { data: notices } = this.props.dashboard?.notices;
        const {userProfileInfo}=this.props;
        const {beneficiaryDetails,hideFiatHeading}=this.state;
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
                        <AlertConfirmation type="error" title={notice.title} showIcon description={notice?.isReqforDoc?"Our Compliance Team is requesting documents in line with your recent transaction, Please click View Details. Thank you for your patience.":"We kindly ask our clients to comply with the Travel Rule and to verify their crypto source and address. Thank you for your cooperation."}
                            action={
                                <Button className='notify-viewbtn' size="small" type="text" onClick={() => this.goToDetails(notice)}>
                                    View Details
                                </Button>
                            } />
                    </div>)}
                </Carousel> : ""}
            <div className='d-flex align-center'>
                <span className="db-main-title"> {(!userProfileInfo.isBusiness  && `${userProfileInfo.firstName} ${userProfileInfo.lastName}`) ||  (userProfileInfo.isBusiness && `${userProfileInfo.businessName}`)}
                </span>
                <span className='acount-type'>{userProfileInfo?.isBusiness ? "Business":"Personal"}</span>
                <div className='acount-type'><Link to="/auth0">Auth0</Link> </div>
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
                <Drawer
          destroyOnClose={true}
          title={[<div className="side-drawer-header" key={""}>
            <span />
            <div className="text-center" key={""}>
              <Paragraph className="drawer-maintitle"><Translate content={hideFiatHeading !==true && "cryptoAddress"}component={Paragraph} className="drawer-maintitle" /></Paragraph>
            </div>
            <span onClick={this.closeCryptoDrawer} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={true}
          visible={beneficiaryDetails}
          closeIcon={null}
          className=" side-drawer"
          size="large"
        >
          <AddressCrypto type="manual" cryptoTab={1} onCancel={(obj) => this.closeCryptoDrawer(obj)} props={this.props} selectedAddress={this.state.selectedObj} headingUpdate={this.headingChange} isSave={true} cryptoId={this.state.cryptoId}/>
        </Drawer>
            </div >
        );


    }
}
const mapStateToProps = ({ userConfig, dashboard, menuItems }) => {
    return { userProfileInfo: userConfig.userProfileInfo, dashboard, twoFA: userConfig.twoFA, cockpitPermissions: menuItems?.featurePermissions?.cockpit,menuItems }
}
export default connect(mapStateToProps, (dispatch) => { return { dispatch } })(Home);