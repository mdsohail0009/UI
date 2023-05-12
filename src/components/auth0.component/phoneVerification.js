import React, { useEffect, useState } from 'react';
import { Steps, Button, Checkbox, Row, Col, Form, Select, Input, Radio, Image, Alert, Spin } from 'antd';
import Mobile from '.././../assets/images/mobile.png';
import { sendOtp, verifyOtp } from './api';
import { getmemeberInfo } from '../../reducers/configReduser';
import { connect } from 'react-redux';

const PhoneVerification = (props) => {
    const [isOtpSent, setSendOTP] = useState(false);
    const [isOtpReSent, setReSendOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [counter, setCounter] = useState(60);
    const [enableResend, setEnableResend] = useState(true);
    const [resendLoader, setResendLoader] = useState(false);


    useEffect(() => {
        handleOtp("send")
        { isOtpSent && <strong >{formattedCount}</strong> }
    }, [])
    const inititeCounter = () => {
        let _count = 60;
        setEnableResend(false);
        const interval = setInterval(() => {
            if (_count === 0) {
                clearInterval(interval);
                setEnableResend(true);
                setReSendOTP(false);
            } else {
                _count--;
                setCounter(_count);
            }
        }, 1000);

    }
    const formattedCount = `${Math.floor(counter / 60)
        .toString()
        .padStart(2, '0')}:${(counter % 60).toString().padStart(2, '0')}`;

    const handleOtp = async (type) => {
        if (type === "resend") {
            setCounter(60);
            setResendLoader(true);
        } else if (type === "send") {
            setCounter(60);
            setResendLoader(true);
        }
        setError(null);
        const res = await sendOtp(type === "resend" ? "resend" : "send");
        if (res.ok) {
            if (type === "resend") {
                setResendLoader(false);
                setReSendOTP(true);
                inititeCounter();
            } else {
                setResendLoader(false);
                setReSendOTP(true);
                inititeCounter();
                setSendOTP(true);
            }
        } else {
            setResendLoader(false)
            setError(res.data?.title || res.data?.message || res.data || res.originalError?.message)
        }
        setLoading(false);
    }
    const verifyOTP = async (values) => {
        setLoading(true);
        const res = await verifyOtp(values.otp);
        if (res.ok) {
            props?.getmemeberInfoa(props?.userProfile.userId)
            props.history.push("/accountstatus")
        } else {
            setError(res.data?.title || res.data?.message || res.data || res.originalError?.message)
        }
        setLoading(false);
    }
    return (
        <>
            <div className='main-container'>
                <div className='register-blockwid form-block mobile-verification'>
                    <h2 class="db-main-title mb-8">Mobile number verification</h2>
                    <p className='text-style mt-0'>We take the security of our users’ data seriously. To protect our users from fraud and abuse, we require you to please verify your mobile number.</p>
                    {error !== null && <Alert type='error' message={error} closable={false}className='mb-alert' showIcon />}
                    <div className='d-flex align-center'>

                        <Form className='' style={{ width: '100%' }} initialValues={{ otp: "" }} onFinish={verifyOTP}>
                            <div className='d-flex '>
                                <div style={{ marginTop: "4px" }}><Image src={Mobile} style={{ paddingRight: "18px" }} preview={false} /></div>
                                <Form.Item
                                    className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error flex-1"
                                    name="otp"
                                    label="Please enter the code that was sent to your mobile number"
                                    rules={[{
                                        required: true,
                                        message: "Please enter otp"
                                    }]}
                                >
                                    <Input
                                        className="cust-input form-disable"
                                        maxLength={6}
                                    // placeholder="Please Enter The Code That Was Sent To Your Mobile Number"
                                    />
                                   
                                </Form.Item>
                            </div>
                            {/* <Button loading={loading} htmlType={isOtpSent ? "submit" : "button"} onClick={isOtpSent ? "" : handleOtp} size="large" block className="pop-btn">{!isOtpSent ? 'Send OTP' : "Verify"} </Button> */}
                            <Button loading={loading} htmlType="submit" size="large" block className="pop-btn">Verify</Button>
                        </Form>
                    </div>

                    <div className='text-center my-24'>
                        {/* <div className='text-style mb-8' >Didn't receive the code?</div>
                        {!isOtpReSent && <div className='text-personal text-spacedec' onClick={() => handleOtp("resend")}>Resend</div>}
                        {isOtpReSent && <div className='text-style mb-8'>You can resend otp again in {formattedCount}</div>} */}
                        <div className='text-style mb-8'>Didn't receive the code? {!isOtpReSent && <span className="text-personal point-cursor c-pointer text-hover" onClick={() => handleOtp("resend")}>Resend
                            {resendLoader && <Spin size='small' />}
                        </span>}{isOtpReSent && <strong >{formattedCount}</strong>}</div>
                    </div>


                    <div className='text-center my-24'>
                        <div className='text-style mb-8'>Having issues with the mobile verification? Please contact us at</div>
                        <div className='text-spacedec width-inc'><a className='text-personal' href="mailto:support@suissebase.io">support@suissebase.io</a></div>
                    </div>

                    {/* <Button htmlType="submit" size="large" block className="pop-btn">Verify </Button> */}
                </div>
            </div>
        </>
    );
}
const connectStateToProps = ({ userConfig }) => {
    return { userProfile: userConfig?.userProfileInfo }
  }
  const connectDispatchToProps = dispatch => {
    return { dispatch,
      getmemeberInfoa: (useremail) => {
        dispatch(getmemeberInfo(useremail));
      }, }
  }
 export default connect(connectStateToProps, connectDispatchToProps)(PhoneVerification);
