import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input, Alert, Tooltip, Row, Col, Checkbox, Modal, message } from "antd";
import { getCode, getVerification, sendEmail, verifyEmailCode, getAuthenticator, getVerificationFields } from "./api";
import { connect } from 'react-redux';
import NumberFormat from "react-number-format";
import { setData } from "@telerik/kendo-intl";

const Verifications = (props) => {

    const [verifyData, setVerifyData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'get_otp', requestType: 'Send', code: '', verified: false,btnloader:false });
    const [phone, setPhone] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'get_otp', requestType: 'Send', verified: false,btnloader:false });
    const [authenticator, setAuthenticator] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'verifyOtpBtn', verified: false,btnloader:false });
    const [phoneSeconds, setPhoneSeconds] = useState(30);
    const [emailSeconds, setEmailSeconds] = useState(30);
    const [errorMsg, setMsg] = useState(false);

    const [form] = Form.useForm();
    const useOtpRef = React.useRef(null);
    const { Text, Title } = Typography;
    const fullNumber = props.auth.phone_number;
    const last4Digits = fullNumber.slice(-4);
    const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

    useEffect(() => {
        getVerifyData();
    }, []);

    let timeInterval;
    let count = 30;
    const startphoneTimer = (secondsType) => {
        let timer = count - 1;
        let seconds;
        timeInterval = setInterval(function () {
            seconds = parseInt(timer % 30);
            setPhoneSeconds(seconds);
            if (--timer < 0) {
                timer = count;
                clearInterval(timeInterval);
            }
        }, 1000);
    };
    let timeIntervalemail;
    let countemail = 30;
    const startemailTimer = (secondsType) => {
        let timer = countemail - 1;
        let seconds;
        timeIntervalemail = setInterval(function () {
            seconds = parseInt(timer % 30);
            setEmailSeconds(seconds);
            if (--timer < 0) {
                timer = countemail;
                clearInterval(timeIntervalemail);
            }
        }, 1000);
    };

    const transferDetials = async (values) => {
       
    };

    const getVerifyData = async () => {
        setIsLoading(true)
        let response = await getVerificationFields(props.userConfig.id);
        if (response.ok) {
            setVerifyData(response.data);
            setIsLoading(false)
        } else {
            setMsg(
                "Without Verifications you can't withdraw.Please select withdraw verifications from security section"
            );
            setIsLoading(false)
        }
    };

    const sendEmailOTP = async (val) => {
        setEmail({...email,btnloader:true})
        let response = await sendEmail(props.userConfig.id, email.requestType);
        if (response.ok) {
        let emailData = { ...email, errorMsg: '', btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to your Email Id`,btnloader:false }
        setEmail(emailData)
        startemailTimer(emailData, 'emailSeconds')
        } else {
            setEmail({ ...email, errorMsg: isErrorDispaly(response), showRuleMsg: '',btnloader:false })
            useOtpRef.current.scrollIntoView(0, 0);
        }
    };

    const verifyEmailOtp = async (values) => {
        setEmail({...email,btnloader:true})
        if(email.code && email.code>5){
        let response = await verifyEmailCode(props.userConfig.id, email.code);
        if (response.ok) {
        setEmail({ ...email, errorMsg: '', verified: true, btnName: 'verified',btnloader:false });
        updateverifyObj(true, 'isEmailVerification')
        } else if (response.data == null) {
            setEmail({ ...email, errorMsg: 'Invalid email verification code', verified: false,btnloader:false });
            updateverifyObj(false, 'isEmailVerification')
        } else {
            useOtpRef.current.scrollIntoView(0, 0);
            setEmail({ ...email, errorMsg: 'Invalid email verification code' ,btnloader:false});
            updateverifyObj(false, 'isEmailVerification')
        }
    }else{
        setEmail({ ...email, errorMsg: 'Invalid email verification code', verified:false,btnloader:false});
    }
    };
    const handleEmailinputChange = (e) => {
        if (e.value) {
            setEmail({ ...email, btnName: 'verifyOtpBtn', code: e.value })
        } else {
            setEmail({ ...email, btnName: 'resendotp', code: '' })
        }
    };

    const handleSendOtp = (val) => {
        // setVerifyEmailText("verifyTextBtn");
        // setTooltipEmail(false);
        // setEmailText(null);
        // setVerify(true);
        // setDisableSave(false);
    };

    const getphoneOTP = async (val) => {
        setPhone({...phone,btnloader:true})
        let response = await getCode(props.userConfig.id, phone.requestType);
        if (response.ok) {
        let phoneData = { ...phone, errorMsg: '', btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to ${maskedNumber}`,btnloader:false }
        setPhone(phoneData)
        startphoneTimer(phoneData, 'phoneSeconds')
        } else {
            setPhone({ ...phone, errorMsg: isErrorDispaly(response), showRuleMsg: '',btnloader:false })
            useOtpRef.current.scrollIntoView(0, 0);
        }
    };
    const handlephoneinputChange = (e) => {
        if (e.value) {
            setPhone({ ...phone, btnName: 'verifyOtpBtn', code: e.value })
        } else {
            setPhone({ ...phone, btnName: 'resendotp', code: '' })
        }
    };
    const verifyPhoneOtp = async () => {
        setPhone({...phone,btnloader:true})
        if(phone.code && phone.code>5){
        let response = await getVerification(props.userConfig.id, phone.code);
        if (response.ok) {
        setPhone({ ...phone, errorMsg: '', verified: true, btnName: 'verified',btnloader:false });
        updateverifyObj(true, 'isPhoneVerification')
        } else if (response.data == null) {
            setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false,btnloader:false });
            updateverifyObj(false, 'isPhoneVerification')
        } else {
            useOtpRef.current.scrollIntoView(0, 0);
            setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false,btnloader:false });
            updateverifyObj(false, 'isPhoneVerification')
        }
    }else{
        setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false ,btnloader:false});
    }
    };

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

    const updateverifyObj = (val, name) => {
        if (name == 'isEmailVerification') {
            props.onchangeData({ verifyData: verifyData, isEmailVerification: val, isAuthenticatorVerification: authenticator.verified, isPhoneVerification: phone.verified })
        } else if (name == 'isPhoneVerification') {
            props.onchangeData({ verifyData: verifyData, isEmailVerification: email.verified, isAuthenticatorVerification: authenticator.verified, isPhoneVerification: val })
        } else if (name == 'isAuthenticatorVerification') {
            props.onchangeData({ verifyData: verifyData, isEmailVerification: email.verified, isAuthenticatorVerification: val, isPhoneVerification: phone.verified })
        }
    }
    const verifyAuthenticatorOTP = async () => {
        setAuthenticator({...authenticator,btnloader:true})
        if(authenticator.code && authenticator.code>5){
        let response = await getAuthenticator(authenticator.code, props.userConfig.id);
        if (response.ok) {
            setAuthenticator({ ...authenticator, errorMsg: '', verified: true, btnName: 'verified',btnloader:false });
            updateverifyObj(true, 'isAuthenticatorVerification')
        } else if (response.data == null) {
            setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code', verified: false ,btnloader:false});
            updateverifyObj(false, 'isAuthenticatorVerification')
        } else {
            useOtpRef.current.scrollIntoView(0, 0);
            setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code',btnloader:false });
            updateverifyObj(false, 'isAuthenticatorVerification')
        }
    }else{
        setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code', verified: false,btnloader:false });
    }
    };
    const handleAuthenticatorinputChange = (e) => {
        if (e.value) {
            setAuthenticator({ ...authenticator, code: e.value })
        } else {
            setAuthenticator({ ...authenticator, code: '' })
        }
    };
    

    const phone_btnList = {
        get_otp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => getphoneOTP()} loading={phone.btnloader}><Text className="text-yellow" >Click here to get Code</Text></Button>
        ),
        resendotp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => getphoneOTP()}
                loading={phone.btnloader}><Text className="text-yellow" >Resend Code</Text></Button>
        ),
        code_Sent: (<>
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
            ><Text
                className={`pl-0 ml-0 text-white-50
        ${"c-notallowed"}`} >Verification code sent</Text></Button>
            <Tooltip
                placement="topRight"
                title={`Haven\'t received code ? Request new code in ${phoneSeconds} seconds. The code will expire after 30mins.`}>
                <span className="icon md info mr-8" />
            </Tooltip>
        </>
        ),
        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
            ><Text className="text-yellow pr-24"> Verified </Text>
                <span className="icon md greenCheck " />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyPhoneOtp()}
                loading={phone.btnloader}><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };
    const email_btnList = {
        get_otp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => sendEmailOTP()} loading={email.btnloader}><Text className="text-yellow" >Click here to get Code</Text></Button>
        ),
        resendotp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => sendEmailOTP()} loading={email.btnloader}><Text className="text-yellow" >Resend Code</Text></Button>
        ),
        code_Sent: (<>
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
            ><Text
                className={`pl-0 ml-0 text-white-50
        ${"c-notallowed"}`} >Verification code sent</Text></Button>
            <Tooltip
                placement="topRight"
                title={`Haven\'t received code ? Request new code in ${emailSeconds} seconds. The code will expire after 30mins.`}>
                <span className="icon md info mr-8" />
            </Tooltip>
        </>
        ),
        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
            ><Text className="text-yellow pr-24"> Verified </Text>
                <span className="icon md greenCheck " />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyEmailOtp()}
                loading={email.btnloader}><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };
    const authenticator_btnList = {

        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
            ><Text className="text-yellow pr-24"> Verified </Text>
                <span className="icon md greenCheck " />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyAuthenticatorOTP()}
                loading={authenticator.btnloader}><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };
    return (
        <div className="mt-16">
            {" "}
            <div ref={useOtpRef}></div>
            {errorMsg && (<Alert showIcon
                type="error"
                message={"Transfer"}
                description={errorMsg}
                closable={false}
            />
            )}
            {isLoading ? (<>
                {/* <Loader /> */}
            </>
            ) : (
                <>
                    <Form
                        className="mt-36"
                        name="advanced_search"
                        form={form}
                        onFinish={transferDetials}
                        autoComplete="off">
                        {verifyData.isPhoneVerified === true && (<>
                            <Text className="fs-14 mb-8 text-white d-block fw-200">
                                Phone verification code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="fs-12 text-white-30 fw-200">
                                            {phone.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-12 text-red fw-200"
                                            style={{ float: "right", color: "var(--textRed)" }}>
                                            {phone.errorMsg}
                                        </Text>
                                    </div>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "is required",
                                    },
                                ]}
                            >
                                <div className="p-relative d-flex align-center">
                                   
                                    <NumberFormat
										customInput={Input}
										thousandSeparator={false}
										prefix={""}
										decimalScale={0}
										allowNegative={false}
										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}
										style={{ width: "100%" }}
										onValueChange={(e) => handlephoneinputChange(e)} minLength={6}
										disabled={phone.btnName == 'get_otp' || phone.btnName == 'verified'}
									/>
                                    <div className="new-add c-pointer get-code text-yellow hy-align">
                                        {phone_btnList[phone.btnName]}
                                    </div>
                                </div>
                            </Form.Item>
                        </>
                        )}
                        {verifyData.isEmailVerification === true && (<>
                            <Text className="fs-14 mb-8 text-white d-block fw-200">
                                Email verification code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="fs-12 text-white-30 fw-200">
                                            {email.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-12 text-red fw-200"
                                            style={{ float: "right", color: "var(--textRed)" }}>
                                            {email.errorMsg}
                                        </Text>
                                    </div>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "is required",
                                    },
                                ]}
                            >
                                <div className="p-relative d-flex align-center">
                                    
                                    <NumberFormat
										customInput={Input}
										thousandSeparator={false}
										prefix={""}
										decimalScale={0}
										allowNegative={false}
										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}
										style={{ width: "100%" }}
										onValueChange={(e) => handleEmailinputChange(e)} minLength={6}
										disabled={email.btnName == 'get_otp' || email.btnName == 'verified'}
									/>
                                    <div className="new-add c-pointer get-code text-yellow hy-align">
                                        {email_btnList[email.btnName]}
                                    </div>
                                </div>
                            </Form.Item>
                        </>
                        )}
                        {verifyData.twoFactorEnabled === true && (<>
                            <Text className="fs-14 mb-8 text-white d-block fw-200">
                                Authenticator code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="fs-12 text-white-30 fw-200">
                                            {authenticator.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-12 text-red fw-200"
                                            style={{ float: "right", color: "var(--textRed)" }}>
                                            {authenticator.errorMsg}
                                        </Text>
                                    </div>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "is required",
                                    },
                                ]}
                            >
                                <div className="p-relative d-flex align-center">
                                    
                                    <NumberFormat
										customInput={Input}
										thousandSeparator={false}
										prefix={""}
										decimalScale={0}
										allowNegative={false}
										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}
										style={{ width: "100%" }}
										onValueChange={(e) => handleAuthenticatorinputChange(e)} minLength={6}
										disabled={authenticator.btnName == 'get_otp' || authenticator.btnName == 'verified'}
									/>
                                    <div className="new-add c-pointer get-code text-yellow hy-align">
                                        {authenticator_btnList[authenticator.btnName]}
                                    </div>
                                </div>
                            </Form.Item>
                        </>
                        )}


                    </Form>
                </>
            )}

        </div>
    );
};

const connectStateToProps = ({ userConfig, oidc }) => {
    return {
        userConfig: userConfig.userProfileInfo,
        auth: oidc.user.profile

    };
};
const connectDispatchToProps = dispatch => {
    return {
        changeInternalStep: (stepcode) => {
            // dispatch(setInternalStep(stepcode))
        },
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(Verifications)