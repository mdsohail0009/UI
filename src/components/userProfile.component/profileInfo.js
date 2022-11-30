import React, { Component } from "react";
import { Typography, Button, Upload, message, Tooltip, Spin, Alert } from "antd";
import { connect } from "react-redux";
import Moment from "react-moment";
import { uploadClient } from "../../api";
import { ProfileImageSave } from "../../api/apiServer";
import { getmemeberInfo, getIpRegisteryData } from "../../reducers/configReduser";
import DefaultUser from "../../assets/images/defaultuser.jpg";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import Loader from "../../Shared/loader";

class ProfileInfo extends Component {
  state = { Image: null, Loader: false, fileLoader: false, errorMessage: null };
  uploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    customRequest: ({ file }) => {

      let formData = new FormData();
      this.setState({ ...this.state, Loader: true });
      formData.append("file", file, file.name);
      uploadClient.post("UploadFile", formData).then((res) => {
        if (res.ok) {
          this.setState({ ...this.state, Loader: false });
          let Obj = {
            ImageURL: res.data[0],
            UserId: this.props.userConfig?.userId
          };

          this.saveImage(Obj);
        } else {
          this.setState({ ...this.state, Loader: false, errorMessage: this.isErrorDispaly(res) });
        }
      });
    },
    beforeUpload: (file) => {
      let fileType = {
        "image/png": true,
        "image/jpg": true,
        "image/jpeg": true,
        "image/PNG": true,
        "image/JPG": true,
        "image/JPEG": true
      };
      let isFileName = file.name.split(".").length > 2 ? false : true;
      if (fileType[file.type] && isFileName) {
        return true;
      } else {
        this.setState({
          ...this.state, Loader: false, errorMessage: isFileName
            ? `File is not allowed. You can upload jpg, png, jpeg files`
            : "File don't allow double extension"
        });
        return Upload.LIST_IGNORE;
      }
    }
  };
  componentDidMount() {
    this.profileTrack();
    this.props.getmemeberInfoa(this.props.userConfig.userId, this.props.userConfig.id);
  }
  profileTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Profile page view",
      Username: this.props.userProfileInfo?.userName,
      customerId: this.props.userProfileInfo?.id,
      Feature: "Profile Info",
      Remarks: "Profile Info page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Profile Info",

    });
  };
  saveImage = async (Obj) => {
    this.setState({ ...this.state, Loader: true });
    Obj.info = JSON.stringify(this.props.trackAuditLogData);
    let res1 = await ProfileImageSave(Obj);
    if (res1.ok) {
      message.success({
        content: "Profile uploaded successfully",
        className: "custom-msg",
        duration: 3
      });
      this.setState({ ...this.state, Loader: false, errorMessage: null });
      this.props.getmemeberInfoa(this.props.userConfig.userId);
    } else {
      this.setState({ ...this.state, Loader: false, errorMessage: this.isErrorDispaly(res1) });
    }
  };
  isErrorDispaly = (objValue) => {
    if (objValue.data && typeof objValue.data === "string") {
      return objValue.data;
    } else if (
      objValue.originalError &&
      typeof objValue.originalError.message === "string"
    ) {
      return objValue.originalError.message;
    } else {
      return "Something went wrong please try again!";
    }
  };

  fileDownload = async () => {
    if (!this.props?.userConfig?.isKYC) {
      this.setState({ ...this.state, Loader: false, errorMessage: "Please complete KYC/KYB" });

    } else if (this.props?.userConfig?.customerState !== "Approved") {
      this.setState({ ...this.state, Loader: false, errorMessage: "Your account approval is in progress state" });
    }
    else {
      this.setState({ ...this.state, fileLoader: true });
      let res = await apiCalls.downloadKyc(this.props.userConfig?.id);
      if (res.ok) {
        window.open(res.data);
        message.destroy();
        message.success({
          content: "Document downloaded successfully",
          className: "custom-msg",
          duration: 3,
        });
        this.setState({ ...this.state, fileLoader: false });
      }
    }
  }

  render() {
    const { Title, Text } = Typography;
    return (
      <>
        {this.state.errorMessage !== null && (
          <Alert
            className="mb-12"
            type="error"
            description={this.state.errorMessage}
            showIcon
          />
        )}
        <div className="profile-info text-center">
          {this.state.Loader && <Loader />}
          {!this.state.Loader && (
            <>
              {this.props.userConfig.imageURL != null && (
                <img
                  src={
                    this.props.userConfig.imageURL
                      ? this.props.userConfig.imageURL
                      : DefaultUser
                  }
                  className="user-profile"
                  alt={"image"}
                />
              )}
              {this.props.userConfig.imageURL == null && (
                <img
                  src={
                    this.props.userConfig.imageURL
                      ? this.props.userConfig.imageURL
                      : DefaultUser
                  }
                  className="user-profile"
                  alt={"image"}
                />
              )}
              <Upload
                {...this.uploadProps}
                accept=".png,.jpeg,.jpg,.JPG,.JPEG,.PNG"
              >
                <Button
                  shape="circle"
                  type="primary"
                  className="img-upld"
                  size="large"
                  icon={<span className="icon md camera" />}
                />
              </Upload>
            </>
          )}
        </div>
        <div className="box contact-info coin-bal">
          <Translate
            content="account_text"
            component={Text}
            className="basicinfo mb-0"
          />
          <ul class="m-0 pl-0">
            {this.state.fileLoader ? <Spin size="Large" style={{ padding: 10 }} /> : <li>
              <Tooltip title="Download">
                <div onClick={this.fileDownload} className="c-pointer"><span className="icon md download" /></div>
              </Tooltip>
            </li>}
          </ul>
        </div>
        <div className="box basic-info">
          <Title className="basicinfo mb-0">
            {" "}
            <Translate
              content="BasicInfo"
              component={Text}
              className="basicinfo"
            />
          </Title>
          <ul className="user-list pl-0">
            {this.props.userConfig.isBusiness && <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="business"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.businessName || "--"}
                </p>
                <div></div>
              </div>
            </li>}
            <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="userName"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.userName || "--"}
                </p>
                <div></div>
              </div>
            </li>
            {this.props.userConfig.isBusiness !== true && <>
              <li className="profileinfo">
                <div className="profile-block ">
                  <label className="mb-0 profile-label">
                    <Translate
                      content="FirstName"
                      component={Text}
                      className="mb-0 profile-label"
                    />
                  </label>
                  <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                    {this.props.userConfig.firstName || "--"}
                  </p>
                  <div></div>
                </div>
              </li>
              {/* <li className="profileinfo">
              <div className="profile-block ">
                <label className="mb-0 profile-label">
                  <Translate
                    content="MiddleName"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.middleName || "--"}
                </p>
                <div></div>
              </div>
            </li> */}
              <li className="profileinfo">
                <div className="profile-block ">
                  <label className="mb-0 profile-label">
                    <Translate
                      content="LastName"
                      component={Text}
                      className="mb-0 profile-label"
                    />
                  </label>
                  <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                    {this.props.userConfig.lastName || "--"}
                  </p>
                  <div></div>
                </div>
              </li></>}
            {/* <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="Birthday"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.dob != null ? <Moment format="DD/MM/YYYY">{this.props.userConfig.dob}
                  </Moment> : "--"}
                </p>
                <div></div>
              </div>
            </li> */}

            <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="ReferenceCode"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.depositReference || "--"}
                </p>
                <div></div>
              </div>
            </li>
          </ul>
        </div>
        <div className="box contact-info">
          <Title className="basicinfo">
            <Translate
              content="ContactInfo"
              component={Text}
              className="basicinfo"
            />
          </Title>
          <ul className="user-list pl-0">
            <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="Country"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.country || "--"}
                </p>
                <div></div>
              </div>
            </li>
            <li className="profileinfo">
              <div className="profile-block">
                <label className="mb-0 profile-label">
                  <Translate
                    content="EmailAddress"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.email || "--"}
                </p>
                <div></div>
              </div>
            </li>
            <li className="profileinfo">
              <div className="profile-block ">
                <label className="mb-0 profile-label">
                  <Translate
                    content="PhoneNumber"
                    component={Text}
                    className="mb-0 profile-label"
                  />
                </label>
                <div style={{ flexGrow: 12 }}>
                  <p className="mb-0 profile-value">
                    {this.props.userConfig.phoneNo || "--"}
                  </p>
                </div>
                <div></div>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
  return {
    userConfig: userConfig.userProfileInfo,
    trackAuditLogData: userConfig.trackAuditLogData
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
    getmemeberInfoa: (useremail, id) => {
      dispatch(getmemeberInfo(useremail, id));
    },
    trackauditlogs: () => {
      dispatch(getIpRegisteryData());
    }
  };

};
export default connect(
  connectStateToProps,
  connectDispatchToProps
)(ProfileInfo);
