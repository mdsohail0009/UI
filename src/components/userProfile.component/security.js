import React, { useState, useEffect } from "react";
import { Typography, Switch, Drawer,message,Button,Checkbox } from "antd";
import Translate from "react-translate-component";
import Changepassword from "../../components/changepassword";
import { connect } from "react-redux";
import { updatechange,withdrawVerifyObj } from "../../reducers/UserprofileReducer";
import { store } from "../../store";
import {success,warning,error} from "../../utils/messages";
import Moment from "react-moment";
import apiCalls from "../../api/apiCalls";

const Security = ({ userConfig, userProfileInfo,userProfile,fetchWithdrawVerifyObj },props) => {
  const [isChangepassword, setisChangepassword] = useState(false);
// const [state,setState]=useState({status:false});
// const [checked,setChecked]=useState(false)
const [factor,setFactor]=useState(false)
const [phone,setPhone]=useState(false)
const [email,setEmail]=useState(false)
  const showDrawer = () => {
    setisChangepassword(true);
    store.dispatch(updatechange());
  };
  useEffect(() => {
    debugger
    securityTrack();
    setFactor(userProfile.withdrawVerifyObj?.TwoFactorEnabled)
    setPhone(userProfile.withdrawVerifyObj?.IsPhoneVerified)
    setEmail(userProfile.withdrawVerifyObj?.Withdrawverification)
     console.log(userProfile.withdrawVerifyObj)
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
      // setState({status:true})
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
//   debugger
//   if(type=="2FA"){
//       setFactor(e.target.checked);
//     }{
      // message.destroy();
      // message.warning({
      //   content: "Please enable 2fa",
      //   className: "custom-msg"
      // });
//       setFactor(e.target.checked=false);
//     }
//   console.log(checked)
// }
}
const saveDetails=async()=>{
  debugger

  let obj={
   // "MemberId":"d3219877-fcbe-4d74-8109-34a304bea85f",
    "MemberId": userConfig.id,
    "Withdrawverification": email,
    "IsPhoneVerified": phone,
    "TwoFactorEnabled":factor
}

const response = await apiCalls.updateSecurity(obj);
if(email&&phone&&factor){
    warning("Please select only two checkboxes") 
}
else if(email&&phone||email&&factor||phone&&factor){
if(response.ok){
  fetchWithdrawVerifyObj(obj);
  success("Data saved successfully") 
}else{
    error(response.data)
}
}
else{
  message.destroy();
  message.warning({
    content: "Please select any two checkboxes",
    className: "custom-msg"
  });
}
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
              {/* <input
              name="isCheck"
              type="checkbox"
              onCheked={factor}
               onChange={(e) => handleInputChange(e,"2FA")}
             
              className="grid_check_box"
            /> */}
            <input
                    className="ant-custumcheck c-pointer"
                      type="checkbox"
                      handleChange={
                        (checked) => handleInputChange(checked)
                        // console.log("PLease select enable")
                        }
                      onCheked={factor}
                      onChange={({ currentTarget: { checked } }) => {
                        setFactor(checked ? true : false );
                      }}
                      defaultChecked={(userProfile.withdrawVerifyObj?.TwoFactorEnabled) || false}
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
                    className="ant-custumcheck c-pointer"
                      type="checkbox"
                      handleChange={(checked) => handleInputChange(checked)}
                      onCheked={phone}
                      onChange={({ currentTarget: { checked } }) => {
                        setPhone(checked ? true : false );
                      }}
                      defaultChecked={(userProfile.withdrawVerifyObj?.IsPhoneVerified) || false}

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
                    className="ant-custumcheck c-pointer"
                      type="checkbox"
                      handleChange={(checked) => handleInputChange(checked)}
                      onCheked={email}
                      onChange={({ currentTarget: { checked } }) => {
                        setEmail(checked ? true : false );
                      }}
                      defaultChecked={(userProfile.withdrawVerifyObj?.Withdrawverification) || false}

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
              <div className="text-center" style={{ flexGrow: 2,marginTop:"-20px",marginLeft:"6cm" }}>
                <Button className="pop-btn px-36" onClick={() => saveDetails()} >
                  save
                </Button>
              </div>
            </div>
          </li>
         
        </ul>
       
      </div>
    </>
  );
};
const connectStateToProps = ({ userConfig, userProfile }) => {
  return { userConfig: userConfig.userProfileInfo, userProfile
    
   };
};
const connectDispatchToProps = (dispatch) => {
  return {
    fetchWithdrawVerifyObj:(obj)=>{
      dispatch(withdrawVerifyObj(obj))
    },
    dispatch
  };
};
export default connect(connectStateToProps,connectDispatchToProps)(Security);
