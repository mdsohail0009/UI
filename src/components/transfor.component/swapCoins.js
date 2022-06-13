import React, { Component } from 'react';
import { Typography, Button, Input, Alert, Spin,Image } from 'antd';
// import { setStepcode } from '../../reducers/tranfor.Reducer';
import { connect } from 'react-redux';

const  TranforCoins = () =>{

} 
const connectStateToProps = ({ userConfig }) => {
    return { userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        // changeStep: (stepcode) => {
        //     dispatch(setStepcode(stepcode))
        // },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(TranforCoins);
