import { useState, useEffect } from "react";
import {useAuth0} from '@auth0/auth0-react'
import { userLogout } from "../reducers/authReducer";
import { clearUserInfo } from "../reducers/configReduser";
import { clearPermissions} from "../reducers/feturesReducer";
import { useDispatch } from "react-redux";
const Wraplogout = (props) => {
    const {logout} = useAuth0();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(props.isLogout){
            dispatch(clearPermissions());
            dispatch(clearUserInfo());
            dispatch(userLogout());
            window.$zoho?.salesiq?.chat.complete();
            window.$zoho?.salesiq?.reset();
            logoutuser()
        }
    },[props.isLogout])
    const logoutuser = () =>{
        logout();
    }
    return(<></>)
};

export default Wraplogout;