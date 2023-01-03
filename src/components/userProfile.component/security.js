
import React, { useState, useEffect } from "react";
import { Typography, Switch, Drawer, Button,  Form, Input, Alert, Row, Col,Spin } from "antd";
import Translate from "react-translate-component";
import Changepassword from "../../components/changepassword";
import { connect } from "react-redux";
import { updatechange, withdrawVerifyObj } from "../../reducers/UserprofileReducer";
import { store } from "../../store";
import { success } from "../../utils/messages";
import Moment from "react-moment";
import apiCalls from "../../api/apiCalls";
import { LoadingOutlined } from "@ant-design/icons";
import Loader from "../../Shared/loader";
const { Title, Paragraph, Text } = Typography;
const Security = ({ userConfig, userProfileInfo, fetchWithdrawVerifyObj,twoFA }) => {
  const [form] = Form.useForm();
  const [isChangepassword, setisChangepassword] = useState(false);
  const [factor, setFactor] = useState(false)
  const [phone, setPhone] = useState(false)
  const [email, setEmail] = useState(false)
  const [live, setLive] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null);
  const useDivRef = React.useRef(null);
  const [isLoading,setIsLoading]=useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [error,setError]=useState(null);

  const showDrawer = () => {
    setisChangepassword(true);
    store.dispatch(updatechange());
  };
  useEffect(() => {
    securityTrack()
    getVerifyData();
  }, []);//eslint-disable-line react-hooks/exhaustive-deps
  const getVerifyData = async () => {
    setIsLoading(true);
    let response = await apiCalls.getVerificationFields();
    if (response.ok) {
      setPhone(response.data?.isPhoneVerified);
      setEmail(response.data?.isEmailVerification);
      setLive(response.data?.isLiveVerification);
      setFactor(response.data?.twoFactorEnabled)
      setIsLoading(false);
      form.setFieldsValue(response.data);
    }
    else{
      return setError(isErrorDispaly(response));
    }
  }
  const isErrorDispaly = (objValue) => {
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
  const securityTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Security page view",
      Username: userProfileInfo?.userName,
      customerId: userProfileInfo?.id,
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
    var url = "";
    if (status) {
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

  const handleInputChange = (e, type) => {
    if (type === "phone") {
      setPhone(e.target.checked ? true : false)
    } else if (type === "email") {
      setEmail(e.target.checked ? true : false)
    } else if (type === "factor") {
      setFactor(e.target.checked ? true : false)
    }
    else if (type === "live") {
      setLive(e.target.checked ? true : false)
    }
  }
  const saveDetails=async()=>{
    setBtnDisabled(true)
    setIsLoading(false)
    setErrorMsg(null);
    if ((live && email) || (live && phone) || (live && factor) || (email && phone)|| (email && factor) || (phone && factor) || (email && phone && factor) ||(email && phone && live) ||(email && live && factor) ||(live && phone && factor)||(email && phone && factor && live)) {
        let obj={
          "customerId": userConfig.id,
          "isEmailVerification": email,
          "IsPhoneVerified": phone,
          "TwoFactorEnabled":factor,
          "isLiveVerification": live
      }
        const response = await apiCalls.updateSecurity(obj);
        if (response.ok) {
          setBtnDisabled(false)
          setErrorMsg(false)
          fetchWithdrawVerifyObj(obj);
          success("Send verification details saved successfully")
          setErrorMsg(null)
          setError(null)
          // useDivRef.current.scrollIntoView();
          setIsLoading(false)

        } else if(email||phone||factor||live===false){
          useDivRef.current.scrollIntoView(0,0);
          setError(isErrorDispaly(response));
           setIsLoading(false)
           setBtnDisabled(false)
        }
        else {
          setError(isErrorDispaly(response))
          setIsLoading(false)
          setBtnDisabled(false)
        }
      }
      else {
        useDivRef.current.scrollIntoView(0,0);
        setError(null);
         setErrorMsg("Please select at least 2 of the Send verification options");
         setIsLoading(false)
         setBtnDisabled(false);         
      }
 }
 const antIcon = (
  <LoadingOutlined
      style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
      spin
  />
);
  return (
    <>

     {isLoading ? (
				<Loader />
			) : (
        <div>
        <div ref={useDivRef}></div>

      {errorMsg !== null && (
        <Alert
          className="mb-12"
          type="error"
          message={"Send Verification"}
          description={errorMsg}
          onClose={() => setErrorMsg(null)}
          showIcon
        />
      )}
       {error !== null && (
        <Alert
          className="mb-12"
          type="error"
          description={error}
          onClose={() => setError(null)}
          showIcon
        />
      )}

      <div className="basicprofile-info">
        <div className="security-align">
          <div>
        <Translate
          content="TwoFactorAuthentication"
          component={Title}
          className="basicinfo"
        />
        <Translate
          content="TwoFactorAuthentication_tag"
          component={Paragraph}
          className="basic-decs"
        />
        </div>
        <ul className="profile-ul">
          <li className="profileinfo">
            <div className="profile-block">
              {/* <label className="mb-0 profile-label ">
                <Translate
                  content="FA_tag"
                  component={Paragraph.label}
                  className="mb-0 profile-label"
                />
              </label> */}
              <p className="profile-value" style={{ flexGrow: 12 }}>
                {twoFA?.isEnabled ? (
                  <Translate
                    content="Enabled"
                    component={Paragraph.p}
                    className="profile-value"
                  />
                ) : (
                  <Translate
                    content="Disabled"
                    component={Paragraph.p}
                    className="profile-value"
                  />
                )}
              </p>
              <div>
                <Switch
                  onChange={(status) => enableDisable2fa(status)}
                  checked={twoFA?.isEnabled}
                  size="medium"
                  className="custom-toggle"
                />
              </div>
            </div>
          </li>
        </ul>
        </div>
      </div>
      <div className="basicprofile-info">
        <Translate
          content="change_pass_word"
          component={Title}
          className="basicinfo"
        />
        <Translate
          content="Choose_a_unique_pass_word_to_protect_your_account"
          component={Paragraph}
          className="basic-decs"
        />
        <ul className="profile-ul">
          <li className="profileinfo c-pointer" onClick={() => showDrawer()}>
            <div className="profile-block">
              <label className="profile-label c-pointer">
                <Translate
                  content="Password"
                  component={Paragraph.label}
                  className="profile-label c-pointer"
                />
              </label>
              <div style={{ flexGrow: 12 }}>
                <p className="profile-value"> ************</p>
                {userConfig?.pwdModifiedDate != null && (
                  <p className="mobile-ml-8 profile-label">
                    <Translate
                      content="Modifiedon"
                      component={Paragraph.p}
                      className="mobile-ml-8 profile-label"
                    />{" "}
                    <Moment format="DD-MM-YYYY">
                      {userConfig?.pwdModifiedDate}
                    </Moment>
                  </p>
                )}
              </div>
              <div className="passwrd-chang-btn">
                {/* <span className="small-btn c-pointer"> */}
                  {/* <Translate
                    content="Click_here_to_change_pass_word"
                    component={Paragraph.span}
                    className="small-btn c-pointer"
                  /> */}
                {/* </span> */}
                {/* <span className="icon md rarrow-white" /> */}
                <Col md={24} xl={24} xxl={24}>
              <div className="text-left passwrd-chang-btn">
              <Button
                        className="profile-sm-btn"
                        // loading={btnDisabled}
                        // onClick={() => saveDetails()}
                        >
                        {/* {isLoading && <Spin indicator={antIcon} />}{" "} */}
                       change
                    </Button>
              </div>
            </Col>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Drawer
        title={[
          <div className="side-drawer-header change_password">
            <span />
            <div className="text-center">
              <Translate
                className="drawer-maintitle rec-bottom"
                content="change_pass_word"
                component={Paragraph}
              />
              <Translate
                content="Choose_a_unique_pass_word_to_protect_your_account"
                component={Paragraph}
                className="recive-subtext"
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

      <div className="box basic-info basicprofile-info">
        <Translate
          content="withdraw_verification"
          component={Title}
          className="basicinfo "
        />
        <Paragraph className="basic-decs">Please select at least 2 of the Send verification options below.</Paragraph>
       
        <Form>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} xl={24} xxl={24}>
              <div className="d-flex align-center mt-16 ">
                <label className="custom-checkbox c-pointer cust-check-outline">
                  <Input
                    name="check"
                    type="checkbox"
                    className="c-pointer"
                    checked={factor}
                    onChange={(e) => handleInputChange(e, "factor")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="FA_tag"
                  component={Paragraph.label}
                  className="security-label-style" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col xs={24} md={24} xl={24} xxl={24}>
              <div className="d-flex align-center mt-16">
                <label className="custom-checkbox c-pointer cust-check-outline">
                  <Input
                    name="check"
                    type="checkbox"
                    className="c-pointer"
                    checked={phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="Phone_verification"
                  component={Paragraph.label}
                  className="security-label-style" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col xs={24} md={24} xl={24} xxl={24}>
              <div className="d-flex align-center mt-16">
                <label className="custom-checkbox c-pointer cust-check-outline">
                  <Input
                    name="check"
                    type="checkbox"
                    className="c-pointer"
                    checked={email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="Email_verification"
                  component={Paragraph.label}
                  className="security-label-style" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col xs={24} md={24} xl={24} xxl={24}>
            {!userConfig?.isBusiness && <div className="d-flex align-center ">
                <label className="custom-checkbox c-pointer cust-check-outline">
                  <Input
                    name="check"
                    type="checkbox"
                    className="c-pointer"
                    checked={live}
                    onChange={(e) => handleInputChange(e, "live")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="live_verification"
                  component={Paragraph.label}
                  className="security-label-style" style={{ flex: 1 }}
                />
              </div>}
            </Col>
            <Col xs={24} md={24} xl={24} xxl={24}>
              <div className="text-left passwrd-chang-btn">
              <Button
                        className="profile-sm-btn"
                        loading={btnDisabled}
                        onClick={() => saveDetails()}>
                        {isLoading && <Spin indicator={antIcon} />}{" "}
                        save
                    </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      </div>
      )}
    </>
  );
};
const connectStateToProps = ({ userConfig, userProfile }) => {
  return {
    userConfig: userConfig.userProfileInfo, userProfile,twoFA:userConfig.twoFA

  };
};
const connectDispatchToProps = (dispatch) => {
  return {
    fetchWithdrawVerifyObj: (obj) => {
      dispatch(withdrawVerifyObj(obj))
    },
    dispatch
  };
};
export default connect(connectStateToProps, connectDispatchToProps)(Security);
