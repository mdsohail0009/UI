import React, { Component } from "react";
import { Typography, Input } from 'antd';
import profile from '../../assets/images/profile.png'

const { Title } = Typography

class ChatBot extends Component {
    render() {
        const { chatTitle } = this.props
        return (
            <>
                <div className="chat-box">
                    <div className="chart-title">
                        <Title className="fs-20 fw-700 mb-0">{chatTitle}</Title>
                    </div>
                    <div className="chat-body">
                        <div className="text-center mb-16">
                            <span className="day-badge">Wed,9 Sep</span>
                        </div>
                        <div className="d-flex align-center mb-16">
                            <img src={profile} className="mr-16" />
                            <div className="msg-body msg-left">
                                <p className="msg-txt">When the drops are smaller, the precipitation is usually called drizzle. See also precipitation.</p>
                                <span className="text-right msg-date">Wed, 9 sep</span>
                            </div>
                        </div>
                        <div className="d-flex align-center mb-16" style={{ justifyContent: 'flex-end' }}>
                            <div className="msg-body msg-right">
                                <p className="msg-txt">When the drops are smaller, the precipitation is usually called drizzle. See also precipitation.</p>
                                <span className="msg-date">Wed, 9 sep</span>
                            </div>
                            <img src={profile} className="ml-16" />
                        </div>
                        <div className="d-flex align-center mb-16">
                            <img src={profile} className="mr-16" />
                            <div className="msg-body msg-left">
                                <p className="msg-txt">the precipitation is usually called drizzle</p>
                                <span className="text-right msg-date">Wed, 9 sep</span>
                            </div>
                        </div>
                        <div className="text-center mb-16">
                            <span className="day-badge">Today</span>
                        </div>
                        <div className="d-flex align-center ml-16  mb-16" style={{ justifyContent: 'flex-end' }}>
                            <div className="msg-body msg-right">
                                <div className="msg-txt d-flex align-center">
                                    <span className="icon xl docu mr-16"></span>
                                    <div><Title className="fs-14 mb-0">Payment Receipt.Pdf</Title>
                                        <span className='fs-12'>125 KB</span></div>
                                </div>
                                <span className="msg-date">Wed, 19 sep</span>
                            </div>
                            <img src={profile} className="ml-16" />
                        </div>
                    </div>
                    <div className="chat-footer">
                        <div className="chat-send">
                            <Input type="text" placeholder="Write your message..." size="large" bordered={false} multiple={true} />
                            <div className="d-flex align-center">
                                <span className="icon md attach mr-16 c-pointer"></span>
                                <div className="send-circle c-pointer">
                                    <span className="icon md send-icon mt-8"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        )
    }
}
export default ChatBot;