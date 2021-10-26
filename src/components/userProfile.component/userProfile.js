import React, { Component } from 'react';
import { Tabs } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import Documents from '../documents.component/documents';
import AddressBook from '../addressbook.component';
import QueryString from 'query-string'
import Settings from './settings';
import Translate from 'react-translate-component';
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
                    <TabPane tab={<span><span className="icon lg profile-icon mr-16" />
                    
                    <Translate content="Profile_Info" className="f-16  mt-16"  />
                    </span>} key="1" className=" ">
                        <ProfileInfo />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />
                    <Translate content="Security" className="f-16  mt-16"  />
                    </span>} key="2">
                        <Security />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg settings-icon mr-16" />
                    <Translate content="Settings" className="f-16  mt-16"  />
                    </span>} key="3">
                    {this.state.activeTab == 3 &&<Settings />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg documents-icon mr-16" />
                    <Translate content="Documents" className="f-16  mt-16"  />
                    </span>} key="4" destroyInactiveTabPane={true}>
                     
                        {this.state.activeTab == 4 &&     <Documents />}
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg addressbook-icon mr-16" />
                    <Translate content="address_book" className="f-16  mt-16"  />
                    </span>} key="5">
                   {this.state.activeTab == 5 &&  <AddressBook  />}
                    </TabPane>
                    
                </Tabs>
            </div>
        </>);
    }
}
export default userProfile;