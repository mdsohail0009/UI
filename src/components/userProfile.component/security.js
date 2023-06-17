
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
import apicalls from "../../api/apiCalls";
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
  const [isResetPassword,setIsResetPassowrd]=useState(false);
  const [error,setError]=useState(null);

  const showDrawer = async() => {
    setIsResetPassowrd(true);
    const res=await apiCalls.resetPassword(userConfig?.id);
    if(res.ok){
      setisChangepassword(true);
      setIsResetPassowrd(false);
      setError(null);
    }
    else{
      setisChangepassword(false);
      setIsResetPassowrd(false);
      return setError(apicalls.isErrorDispaly(res));
    }
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
      return setError(apicalls.isErrorDispaly(response));
    }
  }
  
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
    if ((live || email || phone || factor) ||(live && email) || (live && phone) || (live && factor) || (email && phone)|| (email && factor) || (phone && factor) || (email && phone && factor) ||(email && phone && live) ||(email && live && factor) ||(live && phone && factor)||(email && phone && factor && live)) {
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
          setIsLoading(false)

        } else if(email||phone||factor||live===false){
          useDivRef.current.scrollIntoView(0,0);
          setError(apicalls.isErrorDispaly(response));
           setIsLoading(false)
           setBtnDisabled(false)
        }
        else {
          setError(apicalls.isErrorDispaly(response))
          setIsLoading(false)
          setBtnDisabled(false)
        }
      }
      else {
        useDivRef.current.scrollIntoView(0,0);
        setError(null);
         setErrorMsg("Please select at least one of the verification option");
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
          <li className="profileinfo ">
              <div className="passwrd-chang-btn">
              <div className="text-left passwrd-chang-btn">
              <Button
                        className="profile-sm-btn"
                        loading={isResetPassword}
                        onClick={() => showDrawer()}
                        >
                       Reset Password
                    </Button>
              </div>
              {isChangepassword && <div style={{ flexGrow: 30 }} className="mt-12">
                    <Text
                      className="basicinfo mb-0"
                    > Check Your Email</Text>
                    <Paragraph className="basic-decs">
                      Email send successfully to : {userConfig?.email} please check and reset your password.</Paragraph>
                  </div>
                }
              
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
        // visible={isChangepassword}
        closeIcon={null}
        className="side-drawer"
        destroyOnClose={true}
      >
        <Changepassword onSubmit={() => setisChangepassword(false)} />
      </Drawer>

      <div className="box basic-info basicprofile-info">
        <Translate
          content="withdraw_verification"
          component={Title}
          className="basicinfo "
        />
        <Paragraph className="basic-decs">Please select at least one of the verification options from below.</Paragraph>
       
        <Form>
          <Row gutter={[16, 16]}>
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
