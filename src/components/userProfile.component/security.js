import React, { useState, useEffect } from "react";
import { Typography, Switch, Drawer,message,Button } from "antd";
import Translate from "react-translate-component";
import Changepassword from "../../components/changepassword";
import { connect } from "react-redux";
import { updatechange } from "../../reducers/UserprofileReducer";
import { store } from "../../store";
import Moment from "react-moment";
import apiCalls from "../../api/apiCalls";
import updateSecurity from "../../api/apiCalls"

const Security = ({ userConfig, userProfileInfo }) => {
  const [isChangepassword, setisChangepassword] = useState(false);
const [state,setState]=useState(false)
  const showDrawer = () => {
    setisChangepassword(true);
    store.dispatch(updatechange());
  };
  useEffect(() => {
    debugger
    securityTrack();
  }, []);
  const securityTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Security page view",
      Username: userProfileInfo?.userName,
      MemeberId: userProfileInfo?.id,
      Feature: "Security",
      Remarks: "Security page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Security"
    });
  };
  const onClose = () => {
    setisChangepassword(false);
  };
  const enableDisable2fa = (status) => {
    debugger
    var url = "";
    if (status) {
      setState({status:true})
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/EnableAuthenticator";
    } else {
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/Disable2faWarning";
    }
    window.open(url, "_self");
  };

const handleInputChange=(e,type)=>{
  const target = e.target.value;
if(type=="2FA"){
  debugger
  console.log(state)
  if(state){
   
    console.log("helo",target)
    updateSecurity()
  }else{
    message.destroy();
    message.warning({
      content: "Please enable 2FA",
      className: "custom-msg"
    });
    // value
  }
}
}

const saveDetails=async()=>{
  debugger
  let obj={
    "MemberId":"d3219877-fcbe-4d74-8109-34a304bea85f",
    "Withdrawverification": "true",
    "IsPhoneVerified": "false",
    "TwoFactorEnabled":"false"
}
let response = await updateSecurity(obj);
if(response.ok){
  console.log("submited")
}else{
  console.log("please select 2 boxes")
}
}

  const withdrawVerification=(values)=>{
      
  }
  const { Title, Paragraph } = Typography;
  return (
    <>
      <div className="box basic-info">
        <Translate
          content="TwoFactorAuthentication"
          component={Title}
          className="basicinfo mb-0"
        />
        <Translate
          content="TwoFactorAuthentication_tag"
          component={Paragraph}
          className="basic-decs"
        />
        <ul className="user-list pl-0">
          <li className="profileinfo">
            <div className="profile-block">
              <label className="mb-0 profile-label">
                <Translate
                  content="FA_tag"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                />
              </label>
              <p className="mb-0 profile-value" style={{ flexGrow: 12 }}>
                {userConfig?.twofactorVerified ? (
                  <Translate
                    content="Enabled"
                    component={Paragraph.p}
                    className="mb-0 profile-value"
                  />
                ) : (
                  <Translate
                    content="Disabled"
                    component={Paragraph.p}
                    className="mb-0 profile-value"
                  />
                )}
              </p>
              <div>
                <Switch
                  onChange={(status) => enableDisable2fa(status)}
                  checked={userConfig?.twofactorVerified}
                  size="medium"
                  className="custom-toggle"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="box contact-info">
        <Translate
          content="change_pass_word"
          component={Title}
          className="basicinfo mb-0"
        />
        <Translate
          content="Choose_a_unique_pass_word_to_protect_your_account"
          component={Paragraph}
          className="basic-decs"
        />
        <ul className="user-list pl-0">
          <li className="profileinfo c-pointer" onClick={() => showDrawer()}>
            <div className="profile-block">
              <label className="mb-0 profile-label">
                <Translate
                  content="Password"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                />
              </label>
              <div style={{ flexGrow: 12 }}>
                <p className="mb-0 profile-value"> ************</p>
                {userConfig?.pwdModifiedDate != null && (
                  <p className="mb-0 mobile-ml-8 fs-14 text-white">
                    <Translate
                      content="Modifiedon"
                      component={Paragraph.p}
                      className="mb-0 mobile-ml-8  fs-14 text-white"
                    />{" "}
                    <Moment format="DD-MM-YYYY">
                      {userConfig?.pwdModifiedDate}
                    </Moment>
                  </p>
                )}
              </div>
              <div>
                <span className="text-white">
                  <Translate
                    content="Click_here_to_change_pass_word"
                    component={Paragraph.span}
                    className="text-white"
                  />
                </span>
                <span className="icon md rarrow-white" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Drawer
        title={[
          <div className="side-drawer-header">
            <span />
            <div className="text-center fs-16">
              <Translate
                className="text-white-30 fw-600 text-upper mb-4 d-block"
                content="change_pass_word"
                component={Drawer.title}
              />
              <Translate
                content="Choose_a_unique_pass_word_to_protect_your_account"
                component={Drawer.Paragraph}
                className="mb-16 ml-8 fs-14 text-white mt-8 fw-200 py-16"
              />
            </div>
            <span
              onClick={() => onClose()}
              className="icon md close-white c-pointer"
            />
          </div>
        ]}
        placement="right"
        closable={true}
        visible={isChangepassword}
        closeIcon={null}
        onClose={() => setisChangepassword(false)}
        className="side-drawer"
      >
        <Changepassword onSubmit={() => setisChangepassword(false)} />
      </Drawer>

      <div className="box basic-info">
        <Translate
          content="withdraw_verification"
          component={Title}
          className="basicinfo mb-0"
        />
        <Translate
         content="withdraw_verification_options"
          component={Paragraph}
          className="basic-decs"
        />
        <ul className="user-list pl-0">
          <li className="profileinfo">
            <div className="profile-block" >
              <label className="text-center custom-checkbox" >
              <input
              name="isCheck"
              type="checkbox"
              checked="isChecked"
              onChange={(e) => handleInputChange(e,"2FA")}
              className="grid_check_box"
            />
                <span>{" "}</span>
              </label>
              <br></br>
              <label className="mb-0 profile-label ml-8 fs-14 text-white fw-200" >
                <Translate
                  content="FA_tag"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                  
                />
              </label>
              <label className="text-center custom-checkbox">
                <input
              name="isCheck"
              type="checkbox"
              checked="isChecked"
              onChange={(e) => handleInputChange(e,"Phone verification")}
              className="grid_check_box"
            />
                <span></span>{" "}
              </label>
              <label className="mb-0 ml-8 fs-14 text-white fw-200 " >
                <Translate
                  content="Phone_verification"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                />
              </label>
              
              <label className="text-center custom-checkbox" style={{paddingLeft:60}}>
              <input
              name="isCheck"
              type="checkbox"
              checked="isChecked"
              onChange={(e) => handleInputChange(e,"Email verification")}
              className="grid_check_box"
            />
                <span></span>{" "}
              </label>
              <label className="mb-0 ml-8 fs-14 text-white fw-200">
                <Translate
                  content="Email_verification"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                />
              </label>
            </div>
          </li>
         
        </ul>
        <Button className="pop-btn px-36" onClick={() => saveDetails()} >
          save
        </Button>

      
      </div>
    </>
  );
};
const connectStateToProps = ({ userConfig }) => {
  return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps)(Security);
