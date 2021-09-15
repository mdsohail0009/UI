import React, { Component } from 'react';
import { Row, Col, Typography, Button, Upload, notification, message } from 'antd'
import userProfile from '../../assets/images/profile.png';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { SearchOutlined } from '@ant-design/icons';
import { uploadClient } from '../../api'
import { ProfileImageSave } from '../../api/apiServer'
import { getmemeberInfo } from '../../reducers/configReduser';
import flag from '../../assets/images/flag.png';
import DefaultUser from '../../assets/images/defaultuser.jpg';

import Loader from '../../Shared/loader'

class ProfileInfo extends Component {
    state = { Image: null, Loader: false }
    uploadProps = {
        name: "file",
        multiple: false,
        fileList: [],
        customRequest: ({ file }) => {
            let formData = new FormData();
            this.setState({ ...this.state, Loader: true })
            formData.append(
                "file",
                file,
                file.name
            );
            uploadClient
                .post("UploadFile", formData)
                .then((res) => {
                    if (res.ok) {
                        this.setState({ ...this.state, Loader: false })
                        let Obj = { ImageURL: res.data[0], UserId: this.props.userConfig?.userId }
                        this.saveImage(Obj, res)
                    }
                    else {
                        this.setState({ ...this.state, Loader: false })
                        notification.open({
                            message: "Error",
                            description: 'Something went wrong',
                            placement: "bottomRight",
                            type: "success"
                        });
                    }
                });
        }
    };
    saveImage = async (Obj, res) => {
        this.setState({ ...this.state, Loader: true })
        let res1 = await ProfileImageSave(Obj);
        if (res1.ok) {
            // message.success('Profile uploaded successfully');
            notification.open({
                description: 'Profile uploaded successfully',
                placement: "bottomRight"
            });
            this.setState({ ...this.state, Loader: false })
            this.props.getmemeberInfoa(this.props.userConfig.email)
        } else {
            this.setState({ ...this.state, Loader: false })
        }
    }
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="profile-info text-center">
                {this.state.Loader && <Loader />}
                {!this.state.Loader && <>{this.props.userConfig.imageURL != null && <img src={this.props.userConfig.imageURL ? this.props.userConfig.imageURL : DefaultUser} className="user-profile" />}
                    {this.props.userConfig.imageURL == null && <img src={userProfile} className="user-profile" />}
                    <Upload {...this.uploadProps} accept=".png,.jpeg,.jpg">
                        <Button shape="circle" type="primary" className="img-upld" size="large" icon={<span className="icon md camera" />} />
                    </Upload></>}
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
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block ">
                            <label className="mb-0 profile-label" >Name</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.firstName} {this.props.userConfig.lastName}</p>
                            <div >
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" >Birthday</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>
                                <Moment format="DD/MM/YYYY">{this.props.userConfig.dob}</Moment></p>
                            <div >
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Country</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.country}</p>
                            <div >
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Reference Code</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.depositReference}</p>
                            <div >
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
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
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="d-flex profile-block ">
                            <label className="mb-0 profile-label">Phone Number</label>
                            <div style={{ flexGrow: 12 }}>
                                <p className="mb-0 ml-8 profile-value" >
                                    {/* <span className="mr-12"><img src={flag} style={{width:'30px', height:'30px'}}/></span> */}
                                    {this.props.userConfig.phoneNo}</p>
                            </div>
                            <div >
                                {/* <span className="icon md rarrow-white" /> */}
                            </div>
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
const connectDispatchToProps = dispatch => {
    return {
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(ProfileInfo);