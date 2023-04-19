import {useState} from "react";
import {Typography,List,Button,Image,Dropdown,Space,Menu,} from "antd";
import {Link } from "react-router-dom";
import { Steps } from 'antd';

const {Step}=Steps;

function Auth0() {
    const [current, setCurrent] = useState(1);
    return(
        <div className="main-container">
            <Steps current={current} percent={50} onChange={(c) => {
                setCurrent(c);
            }}>
                <Step title='Finished'></Step>
                <Step title='In Progress'></Step>
                <Step title='Waiting'></Step>
            </Steps>
        </div>
    );
}

export default Auth0;