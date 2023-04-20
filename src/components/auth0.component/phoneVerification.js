import React, { useState } from 'react';
import { Steps, Button, Checkbox,Row,Col,Form,Select,Input,Radio,Image  } from 'antd';
import Mobile from '.././../assets/images/mobile.png';
import {Link } from "react-router-dom";

const PhoneVerification = () => {
    
    return (
        <>
            <div className='main-container'>
                <div className='register-blockwid form-block mobile-verification'>
                    <h2 class="db-main-title mb-8">Mobile Number Verification</h2>
                    <p className='text-style mt-0'>We Take The Security Of Our Users’ Data Seriously. To Protect Our Users From Fraud And Abuse, We Require You To Please Verify Your Mobile Number.</p>
                    <div className='d-flex align-center'>
                        <Image  src={Mobile} style={{paddingRight:"18px"}} preview={false} />
                        <Form className='' style={{width:'100%'}}>
                            <Form.Item
                                className=" mb-8 px-4 text-white-50 custom-forminput custom-label pt-8 sc-error"
                                name="Referral Code"
                                label="
                                Please Enter The Code That Was Sent To Your Mobile Number"
                            >
                                <Input
                                    className="cust-input form-disable"
                                    maxLength={100}
                                    placeholder=""
                                />
                            </Form.Item>
                        </Form>
                    </div>

                    <div className='text-center my-24'>
                        <div className='text-style mb-8' >Didn't Receive The Code?</div>
                        <div className='text-personal c-pointer'>Resend</div>
                    </div>
                    <div className='text-center my-24'>
                        <div className='text-style mb-8'>Having Issues With The Mobile Verification? Please Contact Us At</div>
                        <div className='text-personal c-pointer'>support@suissebase.io</div>
                    </div>

                    <Button htmlType="submit" size="large" block className="pop-btn">Verify </Button>
                </div>
            </div>
        </>
    );
  }
  export default PhoneVerification;