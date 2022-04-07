import React, { Component } from 'react';
import { Tabs } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import Documents from '../documents.component/documents';
import AddressBook from '../addressbook.component';
import QueryString from 'query-string'
import Settings from './settings';
import Cases from '../case.component/cases';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import {addressTabUpdate} from '../../reducers/configReduser'

const { TabPane } = Tabs;
class UserProfile extends Component {
    debugger
    state = {
        isProfile: false,
        isSecurity: false,
        isSetting: false,
        tabPosition: 'left',
        activeTab: "1"

    }
    componentDidMount() {
      
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
        const { tabPosition } = this.state;
        if (this.props.userConfig.addressTab) {
           this.setState({...this.state,activeTab: "5"});
           this.props.dispatch(addressTabUpdate(false));
        }
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
                    {/* <TabPane tab={<span><span className="icon lg documents-icon mr-16" />
                        <Translate content="documents" className="f-16  mt-16" />
                    </span>} key="4" destroyInactiveTabPane={true}>

                        {this.state.activeTab == 4 && <Documents />}
                    </TabPane> */}
                    <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" /><Translate content="address_book" component={Tabs.TabPane.tab} /></span>} key="5">
                        {this.state.activeTab == 5 && <AddressBook />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg cases-icon mr-16" />
                    <Translate content="case" className="f-16  mt-16" /></span>} key="6" >
                        {this.state.activeTab == 6 && <Cases />}
                    </TabPane>

                </Tabs>
            </div>
            {/* <div className="main-container visible-mobile">
                <Tabs className="user-list"  activeKey={this.state.activeTab} onChange={(key)=>this.setState({...this.state,activeTab:key})}>
                    <TabPane tab={<span><span className="icon lg profile-icon mr-16" /><Translate content="ProfileInfo" component={Tabs.TabPane.tab}/></span>} key="1" className=" ">
                        <ProfileInfo />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />
                    <Translate content="security" className="f-16  mt-16"  />
                    </span>} key="2">
                        <Security />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg settings-icon mr-16" />
                    <Translate content="settings" className="f-16  mt-16"  />
                    </span>} key="3">
                    {this.state.activeTab == 3 &&<Settings />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg documents-icon mr-16" />
                    <Translate content="documents" className="f-16  mt-16"  />
                    </span>} key="4" destroyInactiveTabPane={true}>
                     
                        {this.state.activeTab == 4 &&     <Documents />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" /><Translate content="address_book" component={Tabs.TabPane.tab}/></span>} key="5">
                   {this.state.activeTab == 5 &&  <AddressBook  />}
                    </TabPane>
                    
                </Tabs>
            </div> */}
        </>);
    }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig }
}
export default connect(
    connectStateToProps,
   )(UserProfile);
