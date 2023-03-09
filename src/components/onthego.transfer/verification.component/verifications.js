import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input, Alert, Tooltip} from "antd";
import { getCode, getVerification, sendEmail, verifyEmailCode, getAuthenticator, getVerificationFields } from "./api";
import { connect } from 'react-redux';
import LiveNessSumsub from '../../sumSub.component/liveness'
import apicalls from "../../../api/apiCalls";
const Verifications = (props) => {
    const [verifyData, setVerifyData] = useState({});
    const [email, setEmail] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'get_otp', requestType: 'Send', code: '', verified: false,btnLoader:false });
    const [phone, setPhone] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'get_otp', requestType: 'Send', verified: false,btnLoader:false });
    const [authenticator, setAuthenticator] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'verifyOtpBtn', verified: false,btnLoader:false });
    const [liveverification, setLiveverification] = useState({ showRuleMsg: '', errorMsg: '', btnName: 'verifyOtpBtn', verified: false, btnLoader:false, isLiveEnable:false});
    const [phoneSeconds, setPhoneSeconds] = useState(120);
    const [emailSeconds, setEmailSeconds] = useState(120);
    const [errorMsg, setMsg] = useState(false);
    const [phbtnColor,setPhBtnColor]=useState(false)
    const [emailbtnColor,setEmailBtnColor]=useState(false)
    const [authbtnColor,setAuthBtnColor]=useState(false)
    const [form] = Form.useForm();
    const useOtpRef = React.useRef(null);
    const { Text} = Typography;
    const fullNumber = props.auth.phone_number;
    const last4Digits = fullNumber.slice(-4);
    const maskedNumber = last4Digits.padStart(fullNumber.length, "*");
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        loadPermissions();
        getVerifyData();
    }, []);//eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(phoneSeconds===0 && phone.btnName==='code_Sent'){
            setPhone({ ...phone, btnName: 'resendotp', code: '' });
        } else if(phoneSeconds===0 && phone.btnName=== 'verifyOtpBtn'){
                setPhone({ ...phone, btnName: 'resendotp', code: '' });
            }
    }, [phoneSeconds]);//eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(emailSeconds===0 && email.btnName==='code_Sent'){
            setEmail({ ...email, btnName: 'resendotp', code: '' });
        }else if(emailSeconds===0 && email.btnName=== 'verifyOtpBtn'){
            setEmail({ ...email, btnName: 'resendotp', code: '' });
        }
    }, [emailSeconds]);//eslint-disable-line react-hooks/exhaustive-deps

    let timeInterval;
    let count = 120;
    const startphoneTimer = (secondsType) => {
        let timer = count - 1;
        let seconds;
        timeInterval = setInterval(function () {
            seconds = parseInt(timer % 120);
            setPhoneSeconds(seconds);
            if (--timer < 0) {
                timer = count;
                clearInterval(timeInterval);
            }
        }, 1000);
    };
    let timeIntervalemail;
    let countemail = 120;
    const startemailTimer = (secondsType) => {
        let timer = countemail - 1;
        let seconds;
        timeIntervalemail = setInterval(function () {
            seconds = parseInt(timer % 120);
            setEmailSeconds(seconds);
            if (--timer < 0) {
                timer = countemail;
                clearInterval(timeIntervalemail);
            }
        }, 1000);
    };
    const transferDetials = async (values) => {
    };

   const loadPermissions = () => {
		if (props.withdrawCryptoPermissions) {
			let _permissions = {};
			for (let action of props.withdrawCryptoPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
            setPermissions(_permissions);
		}
	}

    const getVerifyData = async () => {
        props.onReviewDetailsLoading(true)
        setMsg(null)
        let response = await getVerificationFields();
        if (response.ok) {
            setVerifyData(response.data);
            props.onReviewDetailsLoading(false)
            setMsg(null)
        } else {
            setMsg(
                "Without Verifications you can't withdraw.Please select withdraw verifications from security section"
            );
           props.onReviewDetailsLoading(false)
        }
    };

    const sendEmailOTP = async (val) => {
        setEmail({ ...email, errorMsg: '', showRuleMsg: '',btnLoader:true })
        setMsg(null)
        let response = await sendEmail( email.requestType);
        if (response.ok) {
        let emailData = { ...email, errorMsg: '', btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to your Email Id`,btnLoader:false }
        setEmail(emailData)
        
        startemailTimer('emailSeconds')
        } else {
            setEmail({ ...email, errorMsg: apicalls.isErrorDispaly(response), showRuleMsg: '',btnLoader:false })
         
        }
    };

    const verifyEmailOtp = async (values) => {
        setMsg(null)
        if(!email.code){
            setEmail({ ...email, errorMsg: 'Please enter email verification code', verified:false});
        }
        if(email.code && email.code>5){
        setEmail({ ...email, errorMsg: '', showRuleMsg: '',btnLoader:true })
        let response = await verifyEmailCode(email.code);
        if (response.ok) {
            setEmailBtnColor(true)
        setEmail({ ...email, errorMsg: '', verified: true, btnName: 'verified', btnLoader:false });
        updateverifyObj(true, 'isEmailVerification')
        } else if (response.data == null) {
            setEmail({ ...email, errorMsg: 'Invalid email verification code', verified: false, btnLoader:false });
            updateverifyObj(false, 'isEmailVerification')
        } else {
            setEmail({ ...email, errorMsg: 'Invalid email verification code', btnLoader:false });
            updateverifyObj(false, 'isEmailVerification')
        }
    }else{
        setEmail({ ...email, errorMsg: 'Invalid email verification code', verified:false});
    }
    };
    const handleEmailinputChange = (e) => {
        if (e.target.value) {
            setEmail({ ...email, btnName: 'verifyOtpBtn', code: e.target.value })
        } else if(emailSeconds===0 && email.btnName==='code_Sent'){
            setEmail({ ...email, btnName: 'resendotp', code: '' })
        } else if(emailSeconds===0 && (email.btnName==='verifyOtpBtn' || email.btnName==='resendotp') && e.target.value == "") {// && phone.btnName==='code_Sent'
            setEmail({ ...email, btnName: 'resendotp', code: '' })
        } else {
            setEmail({ ...email, btnName: 'code_Sent', code: '' })
        }
    };
    const getphoneOTP = async (val) => {
        setPhone({ ...phone, errorMsg: '', showRuleMsg: '', btnLoader:true })
        let response = await getCode(phone.requestType);
        if (response.ok) {
        let phoneData = { ...phone, errorMsg: '', btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to ${maskedNumber}`, btnLoader:false }
        setPhone(phoneData)
        startphoneTimer('phoneSeconds')
        } else {
            setPhone({ ...phone, errorMsg: apicalls.isErrorDispaly(response), showRuleMsg: '', btnLoader:false })
        }
    };
    const handlephoneinputChange = (e) => {
        if (e.target.value) {
            setPhone({ ...phone, btnName: 'verifyOtpBtn', code: e.target.value })
        } else if(phoneSeconds===0 && phone.btnName==='code_Sent') {
            setPhone({ ...phone, btnName: 'resendotp', code: '' })
        }
        else if(phoneSeconds===0 && (phone.btnName==='resendotp' || phone.btnName==='verifyOtpBtn') && e.target.value == "") {// && phone.btnName==='code_Sent'
            setPhone({ ...phone, btnName: 'resendotp', code: '' })
        }else {
            setPhone({ ...phone, btnName: 'code_Sent', code: '' })
        }       
    };
    const verifyPhoneOtp = async () => {
        if(!phone.code){
            setPhone({ ...phone, errorMsg: 'Please enter phone verification code', verified: false, btnLoader: false });
        }
        if (phone.code && phone.code > 5) {
            setPhone({ ...phone, errorMsg: '', showRuleMsg: '', btnLoader: true })
            let response = await getVerification(phone.code);
            if (response.ok) {
                setPhBtnColor(true)
                setPhone({ ...phone, errorMsg: '', verified: true, btnName: 'verified', btnLoader: false });
                updateverifyObj(true, 'isPhoneVerification')
            } else if (response.data == null) {
                setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false, btnLoader: false });
                updateverifyObj(false, 'isPhoneVerification')
            } else {
                setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false, btnLoader: false });
                updateverifyObj(false, 'isPhoneVerification')
            }
        } else {
            setPhone({ ...phone, errorMsg: 'Invalid phone verification code', verified: false, btnLoader: false });
        }
    };

 
    const updateverifyObj = (val, name) => {
        if (name === 'isEmailVerification') {
            props.onchangeData({ verifyData: verifyData,phBtn:phbtnColor, isEmailVerification: val, isAuthenticatorVerification: authenticator.verified, isPhoneVerification: phone.verified })
        } else if (name === 'isPhoneVerification') {
            props.onchangeData({ verifyData: verifyData,emailBtn:emailbtnColor, isEmailVerification: email.verified, isAuthenticatorVerification: authenticator.verified, isPhoneVerification: val })
        } else if (name === 'isAuthenticatorVerification') {
            props.onchangeData({ verifyData: verifyData,authBtn:authbtnColor, isEmailVerification: email.verified, isAuthenticatorVerification: val, isPhoneVerification: phone.verified })
        }
    }
    const verifyAuthenticatorOTP = async () => {
        if(!authenticator.code){
            return setAuthenticator({ ...authenticator, errorMsg: 'Please enter authenticator code', verified: false, btnLoader:false });
        }
        if(authenticator.code && authenticator.code>5){
            setAuthenticator({ ...authenticator, errorMsg: '', verified: false, btnLoader:true });
        let response = await getAuthenticator(authenticator.code);
        if (response.ok) {
            setAuthBtnColor(true)
            setAuthenticator({ ...authenticator, errorMsg: '', verified: true, btnName: 'verified', btnLoader:false });
            updateverifyObj(true, 'isAuthenticatorVerification')
        } else if (response.data == null) {
            setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code', verified: false, btnLoader:false });
            updateverifyObj(false, 'isAuthenticatorVerification')
        } else {
            setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code', btnLoader:false });
            updateverifyObj(false, 'isAuthenticatorVerification')
        }
    }else{
        setAuthenticator({ ...authenticator, errorMsg: 'Invalid authenticator verification code', verified: false, btnLoader:false });
    }
    };
    const handleAuthenticatorinputChange = (e) => {
        if (e.target.value) {
            setAuthenticator({ ...authenticator, code: e.target.value })
        } else {
            setAuthenticator({ ...authenticator, code: '' })
        }
    };

    
    const verifyLiveness = (data) =>{
        if(data.verifed===true){
            setLiveverification({ ...liveverification, errorMsg: '', verified: true, btnName:'verified', btnLoader:false,isLiveEnable:false });
        }else{
            setLiveverification({ ...liveverification, errorMsg: 'Verification faild', verified: false, btnLoader:false });
        }
    }

    const phone_btnList = {
        get_otp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                loading={phone.btnLoader}
                onClick={() => getphoneOTP()}><Text className="text-yellow getcode" >Click here to get code</Text></Button>
        ),
        resendotp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                loading={phone.btnLoader}
                onClick={() => getphoneOTP()}
            ><Text className="text-yellow" >Click here to resend code</Text></Button>
        ),
        code_Sent: (<div style={{ margin: "0 auto"}} className="code-sent-tool-tip code-tooltip-align">
            <Button
                type="text"
                style={{ color: "black",margin: "0 auto" }}
            ><Text
                className={`pl-0 ml-0 mr-0 text-white-50
        ${"c-notallowed"}`} >Verification code sent</Text></Button>
            <Tooltip
                placement="topRight"
                title={`Haven't received code? Request new code in ${phoneSeconds} seconds. The code will expire after 2 Min.`}>
                <span className="icon md info mr-8" />
            </Tooltip>
        </div>
        ),
        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                disabled={true}
            ><Text className="text-yellow pr-24 "> Verified </Text>
                <span className="icon md greenCheck check-ml-align" />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyPhoneOtp()}
                loading={phone.btnLoader}
            ><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };
    const email_btnList = {
        get_otp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                loading={email.btnLoader}
                onClick={() => sendEmailOTP()}><Text className="text-yellow getcode" >Click here to get code</Text></Button>
        ),
        resendotp: (
            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                loading={email.btnLoader}
                onClick={() => sendEmailOTP()}><Text className="text-yellow" >Click here to resend code</Text></Button>
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
                title={`Haven't received code ? Request new code in ${emailSeconds} seconds. The code will expire after 2 Min.`}>
                <span className="icon md info mr-8" />
            </Tooltip>
        </>
        ),
        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                disabled={true}
            ><Text className="text-yellow pr-24"> Verified </Text>
                <span className="icon md greenCheck  check-ml-align" />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyEmailOtp()}
                loading={email.btnLoader}
            ><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };
    const authenticator_btnList = {

        verified: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                disabled={true}
            ><Text className="text-yellow pr-24"> Verified </Text>
                <span className="icon md greenCheck  check-ml-align" />
            </Button>

        ),
        verifyOtpBtn: (

            <Button
                type="text"
                style={{ color: "black", margin: "0 auto" }}
                onClick={() => verifyAuthenticatorOTP()}
                loading={authenticator.btnLoader}
            ><Text className={` text-yellow`} >Click here to verify</Text></Button>
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
            {(
                <>
                    <Form
                        className="verify-btn-from"
                        name="advanced_search"
                        form={form}
                        onFinish={transferDetials}
                        autoComplete="off">
                            <>
                        {verifyData.isPhoneVerified === true && (<>
                            <Text className="label-style">
                            Phone Verification Code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="verification-text">
                                            {phone.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-14 text-red fw-400"
                                            style={{ float: "right" }}>
                                            {phone.errorMsg}
                                        </Text>
                                    </div>
                                }
                                
                            >
                                <div className="p-relative d-flex align-center">
                                <Input
                                            type="text"

                                            className="cust-input custom-add-select mb-0 ibanborder-field"
                                            placeholder={"Enter code"}
                                            maxLength={6}

                                            style={{ width: "100%" }}
                                            disabled={phone.btnName === 'get_otp' || phone.btnName === 'verified'}
                                            onChange={(e) => handlephoneinputChange(e)}
                                            addonAfter={<div className="new-add  hy-align">
                                            {phone_btnList[phone.btnName]}
                                        </div>}
                                        />
                                   
                                 
                                </div>
                            </Form.Item>
                        </>
                        )}
                        {verifyData.isEmailVerification === true && (<>
                            <Text className="label-style">
                                Email Verification Code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="verification-text">
                                            {email.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-14 text-red fw-400"
                                            style={{ float: "right"}}>
                                            {email.errorMsg}
                                        </Text>
                                    </div>
                                }
                              
                            >
                                <div className="p-relative d-flex align-center">
                                <Input
                                            type="text"

                                            className="cust-input custom-add-select mb-0 ibanborder-field"
                                            placeholder={"Enter code"}
                                            maxLength={6}

                                            style={{ width: "100%" }}
                                            disabled={email.btnName === 'get_otp' || email.btnName === 'verified'}
                                            onChange={(e) => handleEmailinputChange(e)}
                                            addonAfter={<div className="new-add  hy-align">
                                            {email_btnList[email.btnName]}
                                        </div>}
                                        />
                                    
                                 
                                </div>
                            </Form.Item>
                        </>
                        )}
                        {verifyData.twoFactorEnabled === true && (<>
                            <Text className="label-style">
                            Authenticator Code *
                            </Text>
                            <Form.Item
                                name="emailCode"
                                className="input-label otp-verify"
                                extra={
                                    <div>
                                        <Text className="verification-text">
                                            {authenticator.showRuleMsg}
                                        </Text>
                                        <Text
                                            className="fs-14 text-red fw-500"
                                            style={{ float: "right",position: "absolute",right: "2px",top: "54px"}}>
                                            {authenticator.errorMsg}
                                        </Text>
                                    </div>
                                }
                                rules={[
                                    {
                                        required: true,
                                        message: "Is required",
                                    },
                                ]}
                            >
                                <div className="p-relative d-flex align-center">
                                <Input
                                            type="text"

                                            className="cust-input custom-add-select mb-0 ibanborder-field"
                                            placeholder={"Enter code"}
                                            maxLength={6}

                                            style={{ width: "100%" }}
                                            disabled={authenticator.btnName === 'get_otp' || authenticator.btnName === 'verified'}
                                            onChange={(e) => handleAuthenticatorinputChange(e)}
                                            addonAfter={ <div className="new-add hy-align">
                                            {authenticator_btnList[authenticator.btnName]}
                                        </div>}
                                        />                                    
                                 
                                </div>
                            </Form.Item>
                        </>
                        )}
                        
                        </>
                            {liveverification.isLiveEnable &&  permissions?.Send &&<>
                                <LiveNessSumsub onConfirm={(data) => verifyLiveness(data)} />
                            </>}

                    </Form>
                </>
            )}

        </div>
    );
};

const connectStateToProps = ({ userConfig, oidc, menuItems }) => {
    return {
        userConfig: userConfig.userProfileInfo,
        auth: oidc.user.profile,
        withdrawCryptoPermissions: menuItems?.featurePermissions?.send_fiat,

    };
};
const connectDispatchToProps = dispatch => {
    return {
       
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(Verifications)