import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd'
import ProfileInfo from './profileInfo';
import Security from './security'
import Translate from 'react-translate-component';
import { userManager } from '../../authentication';
import Settings from './settings';
import Documents from '../documents.component/documents';
const { TabPane } = Tabs;
class userProfile extends Component {
    state = {
        isProfile: false,
        isSecurity: false,
        isSetting: false,
        tabPosition: 'left',

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
            {/* <div className="main-container">
           <Row gutter={24}>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6} className="gutter-row">
                        <div className="left-panel">
                        <ul className="user-list">
                            <li className="user-labels active mb-24" onClick={this.handleProfile}>
                                <div className="d-flex">
                                    <span className="icon lg profile-icon" />
                                    <p className="mb-0 ml-8">Profile Info</p>
                                </div>
                            </li>
                            <li className="user-labels mb-24"  onClick={this.handleSecurity}>
                                <div className="d-flex">
                                    <span className="icon lg security-icon" />
                                    <p className="mb-0 ml-8">Security</p>
                                </div>
                            </li>
                            <li className="user-labels mb-24"  onClick={this.handleSetting}>
                                <div className="d-flex">
                                    <span className="icon lg settings-icon" />
                                    <p className="mb-0 ml-8">Settings</p>
                                </div>
                            </li>
                            <li className="user-labels mb-24"  onClick={this.handleAbout}>
                                <div className="d-flex">
                                    <span className="icon lg info-icon" />
                                    <p className="mb-0 ml-8">About</p>
                                </div>
                            </li>
                            <li className="user-labels mb-24" onClick={() => userManager.signoutRedirect()}>
                                <div className="d-flex">
                                <span className="icon lg info-icon" />
                                    <p className="mb-0 ml-8">Logout</p>
                                </div>
                            </li>

                         
                        </ul>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={18} className="gutter-row">
                        <div className="right-panel">
                            {this.state.isProfile  ?<ProfileInfo/>:""}
                            {this.state.isSecurity? <Security/>:""} 
                            {this.state.isSetting ? <Settings/>:""}
                        </div>
                    </Col>
                </Row> 
            </div> */}
            <div className="main-container">
                <Tabs tabPosition={tabPosition} className="user-list">
                    <TabPane tab={<span><span className="icon lg profile-icon mr-16" />Profile Info</span>} key="1" className=" ">
                        <ProfileInfo />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />Security</span>} key="2">
                        <Security />
                    </TabPane>
                    <TabPane tab={<span><span className="icon lg security-icon mr-16" />Documents</span>} key="3">
                        <Documents />
                    </TabPane>
                    {/* <TabPane tab={ <span><span className="icon lg settings-icon mr-16" />Setting</span>}  key="3">
          <Settings/>
          </TabPane>
          <TabPane tab={ <span><span className="icon lg info-icon mr-16" />About</span>}  key="4">
          <Settings/>
          </TabPane> */}
                    {/* <TabPane tab={ <span onClick={() => userManager.signoutRedirect()}><span className="icon lg logout-icon mr-16" />Logout</span>}>
          </TabPane> */}
                </Tabs>
            </div>
        </>);
    }
}
export default userProfile;