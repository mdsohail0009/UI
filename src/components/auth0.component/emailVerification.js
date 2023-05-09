import React, { useState } from 'react';
import { Image, Spin, Alert } from 'antd';
import SuccessImage from '../../assets/images/success.svg'
import { connect } from 'react-redux';
import { resendEmail } from './api';
import { useAuth0 } from '@auth0/auth0-react';
import { clearPermissions } from '../../reducers/feturesReducer';
import { clearUserInfo } from '../../reducers/configReduser';
import { userLogout } from '../../reducers/authReducer';
import apicalls from '../../api/apiCalls';
const EmailVerification = (props) => {
  const [isEmailResent, setEmailResent] = useState(false);
  const { logout } = useAuth0();
  const [counter, setCounter] = useState(30);
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
   const inititeCounter = () => {
      let _count = 30;
      const interval = setInterval(() => {
          if (_count === 0) {
              clearInterval(interval);
              setEmailResent(false);
          } else {
              _count--;
              setCounter(_count);
          }
      }, 1000);

  }
  const formattedCount = `${Math.floor(counter / 30)
    .toString()
    .padStart(2, '0')}:${(counter % 30).toString().padStart(2, '0')}`;

  const reSendMail = async () => {
    setLoading(true);
    const res = await resendEmail();
    if (res.ok) {
      setEmailResent(true);
      inititeCounter();
     
    }else{
      setLoading(false);
      setError(apicalls.isErrorDispaly(res))
    }
    setLoading(false);    
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
        {/* {error != null && <Alert className="pa-alert" type='error' closable={false} showIcon message={error} />} */}
        {error != null && <Alert type='error' closable={false} showIcon message={error} />}
          <Image src={SuccessImage} preview={false} />
          <h2 class="db-main-title mb-8">Verify your email</h2>
          <div className='text-style mb-8'>We sent a verification email to:</div>
          <div className='text-style mb-8 mt-0'>{props?.userProfile?.email}. Please click the link in the email to continue.</div>
          <div className='text-style mb-8'>Email didn't arrive? {!isEmailResent && <span className="text-personal point-cursor c-pointer" onClick={reSendMail}>Resend {loading&&<Spin size='small' />} </span>}{isEmailResent && <strong>{formattedCount}</strong>}</div>
          <span className='text-personal c-pointer' onClick={signOutUser}>Sign in</span>
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