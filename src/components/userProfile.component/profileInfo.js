import React, { Component } from "react";
import { Typography, Button, Upload, message, Tooltip, Spin, Alert } from "antd";
import { connect } from "react-redux";
import { uploadClient } from "../../api";
import { ProfileImageSave } from "../../api/apiServer";
import { getmemeberInfo, getIpRegisteryData } from "../../reducers/configReduser";
import DefaultUser from "../../assets/images/defaultuser.jpg";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import Loader from "../../Shared/loader";
import { checkCustomerState } from "../../utils/service";

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

    } else if (!checkCustomerState(this.props?.userConfig)) {
      this.setState({ ...this.state, Loader: false, errorMessage: this.props?.userConfig?.customerState==="Under Review"?"Your account is under review state":"Your account approval is in progress state" });
    }
    else {
      this.setState({ ...this.state, fileLoader: true });
      let res = await apiCalls.downloadKyc();
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
      <div className="">
        {this.state.errorMessage !== null && (
          <Alert
            className="mb-12  profile-alert-style"
            type="error"
            description={this.state.errorMessage}
            showIcon
          />
        )}
        </div>
        <div className="profile-image-content">
          <div  className="profile-img-style">
        <div className="profile-info">
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
                  icon={<span className="icon lg camera" />}
                />
              </Upload>
            </>
          )}
        </div>
        </div>
        <div className="dwnl-content-style">
         
          {this.state.fileLoader ? <Spin size="Large" style={{ padding: 10 }} /> : <span>
              <Tooltip title="Download">
                <div onClick={this.fileDownload} className="c-pointer"><span className="icon lg download" /></div>
              </Tooltip>
            </span>}
           
          <Text className="download-content">Download reference confirmation letter</Text>
        </div>
        </div>
        <div className="basic-info basicprofile-info">
          <Title className="basicinfo">
            {" "}
            <Translate
              content="BasicInfo"
              component={Text}
              className="basicinfo"
            />
          </Title>
          <ul className="profile-ul">
            {this.props.userConfig.isBusiness && <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">
                  <Translate
                    content="business"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.businessName || "--"}
                </p>
              </div>
            </li>}
            <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">Username
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.userName || "--"}
                </p>
              </div>
            </li>
            {this.props.userConfig.isBusiness !== true && <>
              <li className="profileinfo">
                <div className="profile-block ">
                  <label className="profile-label">
                    <Translate
                      content="FirstName"
                      component={Text}
                      className="profile-label"
                    />
                  </label>
                  <p className="profile-value" style={{ flexGrow: 12 }}>
                    {this.props.userConfig.firstName || "--"}
                  </p>
                  {/* <div></div> */}
                </div>
              </li>
              {/* <li className="profileinfo">
              <div className="profile-block ">
                <label className="profile-label">
                  <Translate
                    content="MiddleName"
                    component={Text}
                    className="profile-label"
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
                  <label className="profile-label">
                    <Translate
                      content="LastName"
                      component={Text}
                      className="profile-label"
                    />
                  </label>
                  <p className="profile-value" style={{ flexGrow: 12 }}>
                    {this.props.userConfig.lastName || "--"}
                  </p>
                  {/* <div></div> */}
                </div>
              </li></>}
            {/* <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">
                  <Translate
                    content="Birthday"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.dob != null ? <Moment format="DD/MM/YYYY">{this.props.userConfig.dob}
                  </Moment> : "--"}
                </p>
                <div></div>
              </div>
            </li> */}

            <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">
                  <Translate
                    content="ReferenceCode"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.depositReference || "--"}
                </p>
                {/* <div></div> */}
              </div>
            </li>
          </ul>
        </div>
        <div className="basicprofile-info">
          <Title className="basicinfo">
            <Translate
              content="ContactInfo"
              component={Text}
              className="basicinfo"
            />
          </Title>
          <ul className="profile-ul">
            <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">
                  <Translate
                    content="Country"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.country || "--"}
                </p>
                {/* <div></div> */}
              </div>
            </li>
            <li className="profileinfo">
              <div className="profile-block">
                <label className="profile-label">
                  <Translate
                    content="EmailAddress"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <p className="profile-value" style={{ flexGrow: 12 }}>
                  {this.props.userConfig.email || "--"}
                </p>
                {/* <div></div> */}
              </div>
            </li>
            <li className="profileinfo">
              <div className="profile-block ">
                <label className="profile-label">
                  <Translate
                    content="PhoneNumber"
                    component={Text}
                    className="profile-label"
                  />
                </label>
                <div style={{ flexGrow: 12 }}>
                  <p className="profile-value">
                    {this.props.userConfig.phoneNo || "--"}
                  </p>
                </div>
                {/* <div></div> */}
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
