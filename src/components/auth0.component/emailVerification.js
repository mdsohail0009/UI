import React, { useState } from 'react';
import { Image } from 'antd';
import SuccessImage from '../../assets/images/success.svg'
import { connect } from 'react-redux';
import { resendEmail } from './api';
import { useAuth0 } from '@auth0/auth0-react';
import { clearPermissions } from '../../reducers/feturesReducer';
import { clearUserInfo } from '../../reducers/configReduser';
import { userLogout } from '../../reducers/authReducer';

const EmailVerification = (props) => {
  const [isEmailResent, setEmailResent] = useState(false);
  const { logout } = useAuth0();
  const reSendMail = async () => {
    const res = await resendEmail();
    if (res.ok) {
      setEmailResent(true);
    }
  }
  const signOutUser = () => {
    props.dispatch(clearPermissions());
    props.dispatch(clearUserInfo());
    props.dispatch(userLogout());
    logout();
  }
  return (
    <>
      <div className='main-container'>
        <div className='register-blockwid form-block  mobile-verification text-center'>
          <Image src={SuccessImage} preview={false} />
          <h2 class="db-main-title mb-8">Verify Your Email</h2>
          <div className='text-style mb-8'>We Sent A Verification Email To:</div>
          <div className='text-style mb-8 mt-0'>{props?.userProfile?.email}. Please Click The Link In The Email To Continue.</div>
          <div className='text-style mb-8'>Email Didn't Arrive? {!isEmailResent && <span className="text-personal point-cursor c-pointer" onClick={reSendMail}>Resend</span>}{isEmailResent && <span>You can resend again in </span>}</div>
          <div className='text-personal c-pointer' onClick={signOutUser}>Sign In</div>
        </div>
      </div>
    </>
  );
}
const connectStateToProps = ({ userConfig }) => {
  return { userProfile: userConfig?.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return { dispatch }
}
export default connect(connectStateToProps, connectDispatchToProps)(EmailVerification);