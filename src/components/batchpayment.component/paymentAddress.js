import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import List from "../grid.component";
import AddBatchPayment from './addbatchPayment';

const { Title, Text, Paragraph } = Typography;
const PaymentAddress = (props) => {


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
