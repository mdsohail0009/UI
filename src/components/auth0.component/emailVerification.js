import React, { useState } from 'react';
import { Steps, Button, Checkbox,Row,Col,Form,Select,Input,Radio,Image  } from 'antd';
import {Link } from "react-router-dom";
import SuccessImage from '../../assets/images/success.svg'
import { connect } from 'react-redux';

const EmailVerification = (props) => {

    return (
      <>
            <div className='main-container'>
                <div className='register-blockwid form-block  mobile-verification text-center'>
                    <Image  src={SuccessImage} preview={false} />
                    <h2 class="db-main-title mb-8">Verify Your Email</h2>
                    <div className='text-style mb-8'>We Sent A Verification Email To:</div>
                    <div className='text-style mb-8 mt-0'>{props?.userProfile?.email}. Please Click The Link In The Email To Continue.</div>
                    <div className='text-style mb-8'>Email Didn't Arrive? <span className="text-personal">Resend</span></div>
                    <div className='text-personal'>Sign In</div>
                </div>
            </div> 
      </>
    );
  }
  const connectStateToProps = ({ userProfile }) => {
    return { userProfile }
  }
  export default connect(connectStateToProps)(EmailVerification);