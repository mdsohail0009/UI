import React, { Component } from 'react';
import { Row, Col, Typography, Button, Upload } from 'antd'
import userProfile from '../../assets/images/profile.png';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { SearchOutlined } from '@ant-design/icons';

class ProfileInfo extends Component {
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="profile-info text-center">
                <img src={userProfile} className="user-profile" />
                <Upload>
                    <Button shape="circle" type="primary" className="img-upld" size="large" icon={<span className="icon md camera" />} />
                </Upload>
            </div>
            <div className="box basic-info">
                <Title className="basicinfo">Basic Info</Title>
                <Paragraph className="basic-decs">Basic Info, like your name and photo, that you use on Suissebase</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" >Username</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.userName}</p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo active">
                        <div className="d-flex profile-block ">
                            <label className="mb-0 profile-label" >Name</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.firstName} {this.props.userConfig.lastName}</p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" >Birthday</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>
                                <Moment format="DD/MM/YYYY">{this.props.userConfig.dob}</Moment></p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Country</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.country}</p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Reference Code</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.depositReference}</p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
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
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.email}</p>
                            <div>
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                    <li className="profileinfo active">
                        <div className="d-flex profile-block ">
                            <label className="mb-0 profile-label">Phone Number</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.phoneNo}</p>
                            <div >
                                <span className="icon md rarrow-white" /></div>
                        </div>
                    </li>
                </ul>
            </div>

        </>)
    }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(ProfileInfo);