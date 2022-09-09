import React, { Component } from 'react';
import { Tabs } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import AddressBook from '../addressbook.component';
import QueryString from 'query-string'
import Settings from './settings';
import Cases from '../case.component/cases';
import Referral from './referral.component/referral';
import NotificationScreen from "../notification.component/notification";
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import {addressTabUpdate} from '../../reducers/addressBookReducer'
import { setHeaderTab } from "../../reducers/buysellReducer"
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
       activeWithdrawFiat : false
    }
}
    componentDidMount() {
      if(this.props?.match?.path === '/userprofile'){
        let key = " "
       this.props.dispatch(setHeaderTab( " "));
      }
        let activeKey = QueryString.parse(this.props.history.location.search)?.key;
        if (activeKey) {
            this.setState({ ...this.state, activeTab: activeKey });
        }
        if (this.props.addressBookReducer.addressTab) {
            this.setState({...this.state,activeTab:"5",activeWithdrawFiat: true});
            this.props.dispatch(addressTabUpdate(false));
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
        const { tabPosition } = this.state;
        return (<>

            <div className="main-container hidden-mobile">
                <Tabs tabPosition={tabPosition} className="user-list" activeKey={this.state.activeTab} onChange={(key) => this.setState({ ...this.state, activeTab: key })}>
                    <TabPane tab={<span>
                        <span className="icon lg profile-icon mr-16" />
                        <Translate content="ProfileInfo" component={Tabs.TabPane.tab} /></span>} key="1">
                        {this.state.activeTab == 1 && <ProfileInfo />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />
                        <Translate content="security" className="f-16  mt-16" />
                    </span>} key="2">
                        {this.state.activeTab == 2 && <Security />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg settings-icon mr-16" />
                        <Translate content="settings" className="f-16  mt-16" />
                    </span>} key="3">
                        {this.state.activeTab == 3 && <Settings />}
                    </TabPane>
                    {/* <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" /><Translate content="address_book" component={Tabs.TabPane.tab} /></span>} key="5">
                        {this.state.activeTab == 5 && <AddressBook activeFiat = {this.state.activeWithdrawFiat} />}
                    </TabPane> */}
                    <TabPane tab={<span><span className="icon lg cases-icon mr-16" />
                    <Translate content="case" className="f-16  mt-16" /></span>} key="6" >
                        {this.state.activeTab == 6 && <Cases />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg referral-icon mr-16" />
                    <Translate content="referr" className="f-16  mt-16" /></span>} key="7" >
                        {this.state.activeTab == 7 && <Referral />}
                    </TabPane>
                    {/* <TabPane tab={<span><span className="icon lg notification-icon mr-16" />
                    <Translate content="notification" className="f-16  mt-16" /></span>} key="8" >
                        {this.state.activeTab == 8 && <NotificationScreen />}
                        </TabPane> */}
                </Tabs>
            </div>
            <div className="main-container visible-mobile">
            <div className="mb-36 text-white-50 fs-24"><div>Scroll Right to Check Actions<span className="icon sm rightarrow mr-16 c-pointer" /></div></div>
            <Tabs tabPosition="top" className="user-list user-tablist pt-16" activeKey={this.state.activeTab} onChange={(key) => this.setState({ ...this.state, activeTab: key })}>
                    <TabPane tab={<span>
                        <span className="icon lg profile-icon mr-16" />
                        <Translate content="ProfileInfo" component={Tabs.TabPane.tab} /></span>} key="1">
                        {this.state.activeTab == 1 && <ProfileInfo />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />
                        <Translate content="security" className="f-16  mt-16" />
                    </span>} key="2">
                        {this.state.activeTab == 2 && <Security />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg settings-icon mr-16" />
                        <Translate content="settings" className="f-16  mt-16" />
                    </span>} key="3">
                        {this.state.activeTab == 3 && <Settings />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" /><Translate content="address_book" component={Tabs.TabPane.tab} /></span>} key="5">
                        {this.state.activeTab == 5 && <AddressBook activeFiat={this.state.activeWithdrawFiat} />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg cases-icon mr-16" />
                    <Translate content="case" className="f-16  mt-16" /></span>} key="6" >
                        {this.state.activeTab == 6 && <Cases />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg referral-icon mr-16" />
                    <Translate content="referr" className="f-16  mt-16" /></span>} key="7" >
                        {this.state.activeTab == 7 && <Referral />}
                    </TabPane>

                </Tabs>
            </div>
        </>);
    }
}
const connectStateToProps = ({ addressBookReducer}) => {
    return { addressBookReducer }
}
export default connect(
    connectStateToProps,
   )(UserProfile);
