import React from 'react';
import { Typography } from 'antd';
import { connect } from 'react-redux';

const { Title } = Typography;
const PaymentAddress = () => {
    return (
        <>
         <div className="mt-8">
                <Title
                    className='sub-heading code-lbl'>payment Address</Title>
            </div>
        </>
    )
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
  };
  const connectDispatchToProps = dispatch => {
    return {
      dispatch
    }
  }
  
  export default connect(connectStateToProps, connectDispatchToProps)(PaymentAddress);
