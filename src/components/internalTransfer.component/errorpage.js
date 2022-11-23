import React from "react"
import comingsoon from '../../assets/images/errorimg.png'
import {Typography, Button } from "antd";

const { Paragraph, Title} = Typography;

const ErrorPage = () => {

    return <div className="intertrans d-flex">
            <div className="">
              <Title className="fw-700 fs-40 textpure-yellow error-title"> Something's wrong here</Title>
              <Paragraph className="text-white-30 error-content">We can't find the page you're looking for.<br/>check out our help center or head back to home</Paragraph> 
              <Button className="pop-btn custom-send error">Help</Button>
              <Button className="pop-btn custom-send">Home</Button>
            </div>
            <div> <img src={comingsoon} className="error-img"alt="Confirm" /></div>
        </div>

}
export default ErrorPage;