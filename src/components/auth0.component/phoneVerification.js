import React, { useState } from 'react';
import { Steps, Button, Checkbox, Row, Col, Form, Select, Input, Radio, Image, Alert } from 'antd';
import Mobile from '.././../assets/images/mobile.png';
import { sendOtp, verifyOtp } from './api';
const PhoneVerification = (props) => {
    const [isOtpSent, setSendOTP] = useState(false);
    const [isOtpReSent, setReSendOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [counter, setCounter] = useState(60);
    const [enableResend, setEnableResend] = useState(true);
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
    const handleOtp = async (type) => {
        if (type === "resend") {
            setCounter(60);
        }
        setLoading(true);
        setError(null);
        const res = await sendOtp(type === "resend" ? "resend" : "send");
        if (res.ok) {
            if (type === "resend") {
                setReSendOTP(true);
                inititeCounter();
            } else {
                setSendOTP(true);
            }
        } else {
            setError(res.data?.title || res.data?.message || res.data || res.originalError?.message)
        }
        setLoading(false);
    }
    const verifyOTP = async (values) => {
        setLoading(true);
        const res = await verifyOtp(values.otp);
        if (res.ok) {
            props.history.push("/sumsub")
        } else {
            setError(res.data?.title || res.data?.message || res.data || res.originalError?.message)
        }
        setLoading(false);
    }
    return (
        <>
            <div className='main-container'>
                <div className='register-blockwid form-block mobile-verification'>
                    <h2 class="db-main-title mb-8">Mobile Number Verification</h2>
                    <p className='text-style mt-0'>We Take The Security Of Our Users’ Data Seriously. To Protect Our Users From Fraud And Abuse, We Require You To Please Verify Your Mobile Number.</p>
                    {error !== null && <Alert type='error' message={error} closable={false} showIcon />}
                    <div className='d-flex align-center'>
                        <Image src={Mobile} style={{ paddingRight: "18px" }} preview={false} />
                        <Form className='' style={{ width: '100%' }} initialValues={{ otp: "" }} onFinish={verifyOTP}>
                            <Form.Item
                                className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                                name="otp"
                                label="
                                Please Enter The Code That Was Sent To Your Mobile Number"
                                rules={[{
                                    required: true,
                                    message: "Please enter otp"
                                }]}
                            >
                                <Input
                                    className="cust-input form-disable"
                                    maxLength={100}
                                    placeholder="Please Enter The Code That Was Sent To Your Mobile Number"
                                />
                            </Form.Item>
                            <Button loading={loading} htmlType={isOtpSent ? "submit" : "button"} onClick={isOtpSent ? "" : handleOtp} size="large" block className="pop-btn">{!isOtpSent ? 'Send OTP' : "Verify"} </Button>

                        </Form>
                    </div>

                    <div className='text-center my-24'>
                        <div className='text-style mb-8' >Didn't Receive The Code?</div>
                        {!isOtpReSent && <div className='text-personal c-pointer' onClick={() => handleOtp("resend")}>Resend</div>}
                        {isOtpReSent && <div className='text-style mb-8'>You can resend otp again in {counter}</div>}
                    </div>
                    <div className='text-center my-24'>
                        <div className='text-style mb-8'>Having Issues With The Mobile Verification? Please Contact Us At</div>
                        <div className='text-personal c-pointer'>support@suissebase.io</div>
                    </div>

                    {/* <Button htmlType="submit" size="large" block className="pop-btn">Verify </Button> */}
                </div>
            </div>
        </>
    );
}
export default PhoneVerification;