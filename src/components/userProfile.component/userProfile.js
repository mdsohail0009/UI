import React, { Component } from 'react';
import { Row, Col } from 'antd'
import ProfileInfo from './profileInfo';

class userProfile extends Component {
    state={
       isProfile:false,
    }
    handleProfile=() =>{
         this.setState({isProfile:true})
    }
    handleSecurity=() =>{

    }
    handleSetting=() =>{
        
    }
    handleAbout=() =>{
        
    }
    handleLogout=() =>{
        
    }
    render() {
        return (<>
            <div className="main-container">
                <Row gutter={24}>
                    <Col span={6} className="gutter-row">
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
                            <li className="user-labels mb-24"  onClick={this.handleLogout}>
                                <div className="d-flex">
                                <span className="icon lg info-icon" />
                                    <p className="mb-0 ml-8">Logout</p>
                                </div>
                            </li>

                         
                        </ul>
                        </div>
                    </Col>
                    <Col span={18} className="gutter-row">
                        <div className="right-panel">
                            {this.state.isProfile  &&<ProfileInfo/>} 
                        </div>
                    </Col>
                </Row>
            </div>
        </>);
    }
}
export default userProfile;