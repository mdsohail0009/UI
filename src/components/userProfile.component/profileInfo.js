import React, { Component } from 'react';
import { Typography, Button, Upload, notification, message } from 'antd'
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { uploadClient } from '../../api'
import { ProfileImageSave } from '../../api/apiServer'
import { getmemeberInfo } from '../../reducers/configReduser';
import DefaultUser from '../../assets/images/defaultuser.jpg';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';

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
    componentDidMount() {
        this.profileTrack();
    }
    profileTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Profile page view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Profile Info', "Remarks": 'Profile Info page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Profile Info' });
    }
    saveImage = async (Obj, res) => {
        this.setState({ ...this.state, Loader: true })
        let res1 = await ProfileImageSave(Obj);
        if (res1.ok) {
            message.success({ content: 'Profile uploaded successfully', className: 'custom-msg' });
            this.setState({ ...this.state, Loader: false })
            this.props.getmemeberInfoa(this.props.userConfig.userId)
        } else {
            this.setState({ ...this.state, Loader: false })
        }
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (<>
            <div className="profile-info text-center">
                {this.state.Loader && <Loader />}
                {!this.state.Loader && <>{this.props.userConfig.imageURL != null && <img src={this.props.userConfig.imageURL ? this.props.userConfig.imageURL : DefaultUser} className="user-profile" alt={"image"} />}
                    {this.props.userConfig.imageURL == null && <img src={this.props.userConfig.imageURL ? this.props.userConfig.imageURL : DefaultUser} className="user-profile" alt={"image"} />}
                    <Upload {...this.uploadProps} accept=".png,.jpeg,.jpg">
                        <Button shape="circle" type="primary" className="img-upld" size="large" icon={<span className="icon md camera" />} />
                    </Upload></>}
            </div>

            <div className="box basic-info">
                <Title className="basicinfo mb-0"> <Translate content="BasicInfo" component={Text} className="basicinfo" /></Title>
                <Paragraph className="basic-decs"><Translate content="BasicInfotag" component={Text} className="basic-decs" /></Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="profile-block">
                            <label className="mb-0 profile-label" ><Translate content="userName" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.userName}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block ">
                            <label className="mb-0 profile-label" ><Translate content="FirstName" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.firstName}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block ">
                            <label className="mb-0 profile-label" ><Translate content="MiddleName" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.middleName || '---'}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block ">
                            <label className="mb-0 profile-label" ><Translate content="LastName" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.lastName}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block">
                            <label className="mb-0 profile-label" ><Translate content="Birthday" component={Text} className="mb-0 profile-label" /></label>
                            {this.props.userConfig.dob != null && <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                                <Moment format="DD/MM/YYYY">{this.props.userConfig.dob}</Moment></p>}
                            <div >
                            </div>
                        </div>
                    </li>

                    <li className="profileinfo">
                        <div className="profile-block">
                            <label className="mb-0 profile-label"><Translate content="ReferenceCode" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.depositReference}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="box contact-info">
                <Title className="basicinfo"><Translate content="ContactInfo" component={Text} className="basicinfo" /></Title>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="profile-block">
                            <label className="mb-0 profile-label"><Translate content="Country" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.country}</p>
                            <div >
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block">
                            <label className="mb-0 profile-label"><Translate content="EmailAddress" component={Text} className="mb-0 profile-label" /></label>
                            <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.email}</p>
                            <div>
                            </div>
                        </div>
                    </li>
                    <li className="profileinfo">
                        <div className="profile-block ">
                            <label className="mb-0 profile-label"><Translate content="PhoneNumber" component={Text} className="mb-0 profile-label" /></label>
                            <div style={{ flexGrow: 12 }}>
                                <p className="mb-0 profile-value" >
                                    {this.props.userConfig.phoneNo}</p>
                            </div>
                            <div >
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