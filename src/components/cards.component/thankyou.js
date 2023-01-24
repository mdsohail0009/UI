import React, { Component } from "react";
import { Image, Typography, Button } from "antd";
import success from "../../assets/images/success.svg";
import inprogress from "../../assets/images/pending1.png";
import rejected from "../../assets/images/reject.png";
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;

class CardStatus extends Component {
    state = {
        images: {
            success: success,
            inprogress: inprogress,
            rejected: rejected,
        },
        messages: {
            submitted: <div>We are currently reviewing your application and we will be in touch soon regarding the outcome of your application. If you have any questions, please contact our support at <Link className="a-text"></Link><a href="mailto:support@suissebase.ch">support@suissebase.ch</a></div>,
            // inprogress: 'We are in the process of reviewing the information for your application. We will notify you via email about the outcome of your application. If you have any questions, please contact our support at support@suissebase.ch ',
            inprogress: <div>We are in the process of reviewing the information for your application. We will notify you via email about the outcome of your application. If you have any questions, please contact our support at <Link className="a-text"></Link><a href="mailto:support@suissebase.ch">support@suissebase.ch</a></div>,
            rejected: <div>We regret to inform you that we are presently unable to approve your application Suissebase Corporate Expense Card. If you have any questions, please contact our support at <Link className="a-text"></Link><a href="mailto:support@suissebase.ch">support@suissebase.ch</a></div>
        },
        titles:{
            submitted: 'Thank you for applying for Suissebase Corporate Expense Card!',
            inprogress: 'Suissebase Corporate Expense Card Your application is being reviewed. ',
            rejected:'Suissebase Corporate Expense Card Your application has not been approved.'
        }
    }
    render() {
        return (
            <div className="main-container">
                <div className="text-center submission-sec">
                    <Image width={80} preview={false} src={this.state.images[this.props.status?.toLowerCase()] || success} />
                    <Title level={2} className="text-white my-16 mb-0">{this.state.titles[this.props.status?.toLowerCase()]} </Title>
                    <Text className="text-white-30">{this.state.messages[this.props.status?.toLowerCase()]}</Text>
                    <div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO COCKPIT</Button>
                    </div>
                </div>

            </div>
        )
    }

}
export default CardStatus;