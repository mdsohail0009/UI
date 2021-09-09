import React, { Component } from 'react';
import { Row, Col, Typography } from 'antd'
import userProfile from '../../assets/images/profile.png';

class ProfileInfo extends Component {
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="profile-info mb-16" style={{ paddingLeft: '30px', textAlign: 'center', }}>
                <img src={userProfile} className="user-profile" />
            </div>
            <div className="box basic-info">
                <Title className="basicinfo">Basic Info</Title>
                <Paragraph className="basic-decs">Basic Info, like your name and photo, that you use on Suissebase</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                          <label className="mb-0 profile-label" >Username</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>John_123</p>
                            <div >
                            <span className="icon md rarrow-white"  /></div>
                        </div>
                    </li>
                    <li className="profileinfo active">
                        <div className="d-flex profile-block ">
                          <label className="mb-0 profile-label" >Name</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>John Doe Mile</p>
                            <div >
                            <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                          <label className="mb-0 profile-label" >Birthday</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>12/04/2000</p>
                            <div >
                            <span className="icon md rarrow-white"  /></div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                          <label className="mb-0 profile-label">Country</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>India</p>
                            <div >
                            <span className="icon md rarrow-white"  /></div>
                        </div>
                    </li>
                    
                </ul>
            </div>
            <div className="box contact-info">
                <Title className="basicinfo">Contact Info</Title>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                          <label className="mb-0 profile-label">Email Address</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>Johndoe@suissebase.com</p>
                            <div>
                            <span className="icon md rarrow-white"  /></div>
                        </div>
                    </li>
                    <li className="profileinfo active">
                        <div className="d-flex profile-block ">
                          <label className="mb-0 profile-label">Phone Number</label>
                            <p className="mb-0 ml-8 profile-value" style={{flexGrow:12}}>4234354546</p>
                            <div >
                            <span className="icon md rarrow-white"  /></div>
                        </div>
                    </li>
                    </ul>
            </div>
          
        </>)
    }
}
export default ProfileInfo;