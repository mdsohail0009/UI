import React, { Component } from 'react';
import { Tabs,Typography, } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import QueryString from 'query-string'
import Referral from './referral.component/referral';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { setHeaderTab } from "../../reducers/buysellReducer"
import { getScreenName } from "../../reducers/feturesReducer";
import { withRouter } from 'react-router-dom';
import SuisseBaseCreditCom from './suissebaseCredit';
import BackUpAddress from './backUpAddress.component/index';
import BankReferenceLatter from './BankReferenceLetter.component/index';
import { BrowserView, MobileView} from 'react-device-detect';
const {  Title } = Typography; 
const { TabPane } = Tabs;
class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProfile: false,
            isSecurity: false,
            isSetting: false,
            tabPosition: 'left',
            activeTab: this.props.match.params.key ? this.props.match.params.key : "1",
            activeWithdrawFiat: this.props.match.params.type === 'fiat' ? true : false
        }
    }
    componentDidMount() {
        this.props.dispatch(getScreenName({getScreen:null}))
        if (this.props?.match?.path === '/userprofile') {
            this.props.dispatch(setHeaderTab(" "));
        }
        let activeKey = QueryString.parse(this.props.history.location.search)?.key;
        if (activeKey) {
            this.setState({ ...this.state, activeTab: activeKey });
        }
    }

    handleProfile = () => {
        this.setState({ isProfile: true })
    }
    handleSecurity = () => {
        this.setState({ isSecurity: true, isProfile: false })
    }
    handleSetting = () => {
        this.setState({ isSetting: true, isProfile: false })
    }

    render() {
        const { tabPosition, activeTab } = this.state;
        if (this.props.match.params.key !== activeTab) {
            if (this.props.match.params.key) {
                this.setState({ ...this.state, activeTab: this.props.match.params.key })
            } else {
                this.props.history.push(`/userprofile/${activeTab}`)
            }
        }
        return (<>
           
            <div className="main-container hidden-mobile">
            <div>
                <Title className="db-main-title">Manage your account</Title> 
            </div>
                <Tabs tabPosition={tabPosition} className="user-list" activeKey={this.state.activeTab} onChange={(key) => {
                    this.props.history.push(`/userprofile/${key}`)
                    this.setState({ ...this.state, activeTab: key })
                }}>
                    <TabPane tab={<div>
                        <span className="icon lg profile-icon" />
                        <Translate content="ProfileInfo" component={Tabs.TabPane.tab} className="tabtitle" /></div>} key="1">
                        {this.state.activeTab == 1 && <ProfileInfo />}
                    </TabPane>
                    <TabPane tab={<div><span className="icon lg security-icon" />
                        <Translate content="security" className="tabtitle" />
                        </div>} key="2">
                        {this.state.activeTab == 2 && <Security />}
                    </TabPane>
                    <TabPane tab={<div><span className="icon lg referral-icon" />
                        <Translate content="referr" className="tabtitle" /></div>} key="7" >
                        {this.state.activeTab == 7 && <Referral />}
                    </TabPane>
                    <TabPane className='back-up-tab' tab={<div className='d-flex align-item-center'><span className="icon lg bank-letter" />
                       <span className="tabtitle backup-admb-0">Bank Reference Letter</span>
                        </div>} key="4">
                            <BrowserView> {this.state.activeTab == 4 && <BankReferenceLatter />}</BrowserView>
               
                    </TabPane>
                    <TabPane className='back-up-tab' tab={<div className='d-flex align-item-center back-up-tab'><span className="icon lg backup-icon" />
                       <span className="tabtitle backup-admb-0">Backup Address</span>
                        </div>} key="3">
                        {this.state.activeTab == 3 && <BackUpAddress />}
                    </TabPane>
                    <TabPane tab={<div><span className="icon lg suissebase-credit" />
                        <Translate content="suissebase_credit" className="tabtitle" /></div>} key="8" >
                        {this.state.activeTab == 8 && <SuisseBaseCreditCom/>}
                    </TabPane>
                   
                </Tabs>
            </div>
            <div className="main-container visible-mobile">
                <div className="profile-value"><div className='moble-mb-style'>Scroll Right to Check Actions<span className="icon sm rightarrow c-pointer arrow-ml" /></div></div>
                <Tabs tabPosition={"top"} className="user-list user-tablist pt-16" activeKey={this.state.activeTab} onChange={(key) => {
                    this.props.history.push(`/userprofile/${key}`)
                    this.setState({ ...this.state, activeTab: key })
                }}>
                    <TabPane tab={<span>
                        <span className="icon lg profile-icon " />
                        <Translate content="ProfileInfo" component={Tabs.TabPane.tab} className="tabtitle" /></span>} key="1">
                        {this.state.activeTab == 1 && <ProfileInfo />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon " />
                        <Translate content="security" className="tabtitle" />
                    </span>} key="2">
                        {this.state.activeTab == 2 && <Security />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg referral-icon " />
                        <Translate content="referr" className="tabtitle" /></span>} key="7" >
                        {this.state.activeTab == 7 && <Referral />}
                    </TabPane>
                <TabPane className='back-up-tab mobile-show' tab={<div className='d-flex align-item-center'><span className="icon lg bank-letter" />
                    <span className="tabtitle backup-admb-0">Bank Reference Letter</span>
                    </div>} key="4">
                        <MobileView>{this.state.activeTab == 4 && <BankReferenceLatter />}</MobileView>
                    
                </TabPane>
                    <TabPane className='back-up-tab' tab={<div className='d-flex align-item-center'><span className="icon lg backup-icon" />
                       <span className="tabtitle backup-admb-0">Backup Address</span>
                        </div>} key="3">
                        {this.state.activeTab == 3 && <BackUpAddress />}
                    </TabPane>
                    <TabPane tab={<div><span className="icon lg suissebase-credit" />
                        <Translate content="suissebase_credit" className="tabtitle" /></div>} key="8" >
                        {this.state.activeTab == 8 && <SuisseBaseCreditCom/>}
                    </TabPane>
                  
                </Tabs>
            </div>
        </>);
    }
}
const connectStateToProps = ({ addressBookReducer }) => {
    return { addressBookReducer }
}
export default connect(
    connectStateToProps,
)(withRouter(UserProfile));
