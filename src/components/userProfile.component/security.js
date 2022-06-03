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
const { Title, Paragraph, Text } = Typography;
const Security = ({ userConfig, userProfileInfo, fetchWithdrawVerifyObj,twoFA }) => {
  const [form] = Form.useForm();
  const [isChangepassword, setisChangepassword] = useState(false);
  const [factor, setFactor] = useState(false)
  const [phone, setPhone] = useState(false)
  const [email, setEmail] = useState(false)
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
  }, []) //eslint-disable-line react-hooks/exhaustive-deps
  const getVerifyData = async () => {
    let response = await apiCalls.getVerificationFields(userConfig.id);
    if (response.ok) {
      setPhone(response.data?.isPhoneVerified);
      setEmail(response.data?.isEmailVerification);
      setFactor(response.data?.twoFactorEnabled)
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
  }
  const saveDetails=async()=>{
    setBtnDisabled(true)
    setIsLoading(false)
    setErrorMsg(null);
      if ((email && phone)|| (email && factor) || (phone && factor) || (email && phone && factor)) {
        let obj={
          "MemberId": userConfig.id,
          "isEmailVerification": email,
          "IsPhoneVerified": phone,
          "TwoFactorEnabled":factor
      }
        const response = await apiCalls.updateSecurity(obj);
        if (response.ok) {
          setBtnDisabled(false)
          setErrorMsg(false)
          fetchWithdrawVerifyObj(obj);
          success("Withdrawal verification details saved successfully")
          setErrorMsg(null)
          setError(null)
          useDivRef.current.scrollIntoView();
          setIsLoading(false)

        } else if(email||phone||factor===false){
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
         setErrorMsg("Please select at least 2 of the withdrawal verification options");
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
      <div ref={useDivRef}></div>

      {errorMsg !== null && (
        <Alert
          className="mb-12"
          type="error"
          message={"Withdrawal Verification"}
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
                {twoFA?.isEnabled ? (
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
                  checked={twoFA?.isEnabled}
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
        <Paragraph className="basic-decs">Please select <Text className="text-yellow fw-700">at least 2 </Text> of the withdrawal verification options below.</Paragraph>
       
        <Form>
          <Row gutter={[16, 16]}>
            <Col md={4} xl={4} xxl={4}>
              <div className="d-flex align-center mt-16 ">
                <label className="custom-checkbox p-relative c-pointer">
                  <Input
                    name="check"
                    type="checkbox"
                    checked={factor}
                    onChange={(e) => handleInputChange(e, "factor")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="FA_tag"
                  component={Paragraph.label}
                  className="mb-0 profile-label ml-8" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col md={7} xl={7} xxl={7}>
              <div className="d-flex align-center mt-16">
                <label className="custom-checkbox p-relative c-pointer">
                  <Input
                    name="check"
                    type="checkbox"
                    checked={phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="Phone_verification"
                  component={Paragraph.label}
                  className="mb-0 profile-label ml-8" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col md={7} xl={7} xxl={7}>
              <div className="d-flex align-center mt-16">
                <label className="custom-checkbox p-relative c-pointer">
                  <Input
                    name="check"
                    type="checkbox"
                    checked={email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                  <span></span>
                </label>
                <Translate
                  content="Email_verification"
                  component={Paragraph.label}
                  className="mb-0 profile-label ml-8" style={{ flex: 1 }}
                />
              </div>
            </Col>
            <Col md={6} xl={6} xxl={6}>
              <div className="text-right">
              <Button
                        className="pop-btn px-36"
                        loading={btnDisabled}
                        style={{ height: 44,minWidth: 100 }} onClick={() => saveDetails()}>
                        {isLoading && <Spin indicator={antIcon} />}{" "}
                        save
                    </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
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
