import React, { Component } from 'react';
import { Tabs } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import Documents from '../documents.component/documents';
import AddressBook from '../addressbook.component';
import QueryString from 'query-string'
const { TabPane } = Tabs;
class userProfile extends Component {
    state = {
        isProfile: false,
        isSecurity: false,
        isSetting: false,
        tabPosition: 'left',
        activeTab:"1"

    }
    componentDidMount(){
        let activeKey = QueryString.parse(this.props.history.location.search)?.key;
        if(activeKey){
            this.setState({...this.state,activeTab:activeKey});
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
    handleAbout = () => {

    }
    handleLogout = () => {

    }
    render() {
        const { tabPosition } = this.state;
        return (<>
           
            <div className="main-container">
                <Tabs tabPosition={tabPosition} className="user-list"  activeKey={this.state.activeTab} onChange={(key)=>this.setState({...this.state,activeTab:key})}>
                    <TabPane tab={<span><span className="icon lg profile-icon mr-16" />Profile Info</span>} key="1" className=" ">
                        <ProfileInfo />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />Security</span>} key="2">
                        <Security />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg documents-icon mr-16" />Documents</span>} key="3" destroyInactiveTabPane={true}>
                     
                        {this.state.activeTab == 3 &&     <Documents />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" />Address Book</span>} key="4">
                   {this.state.activeTab == 4 &&  <AddressBook  />}
                    </TabPane>
                    
                </Tabs>
            </div>
        </>);
    }
}
export default userProfile;