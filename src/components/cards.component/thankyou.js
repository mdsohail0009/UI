import React, { Component } from "react";
import { Image, Typography, Button } from "antd";
import success from "../../assets/images/success.png";
import inprogress from "../../assets/images/pending.png";
import rejected from "../../assets/images/reject.png";
const { Title, Text } = Typography;

class CardStatus extends Component {
    state = {
        images: {
            inprogress: inprogress,
            rejected: rejected,
        },
        messages: {
            inprogress: 'Application for Suissebase Corporate Expense Card Is Under Review',
            rejected: "Application for Suissebase Corporate Expense Card Is Rejected, Please contact admin"
        },
        titles:{
            inprogress: 'In-Progress',
            rejected:'Rejected'
        }
    }
    render() {
        return (
            <div className="main-container">
                <div className="text-center submission-sec">
                    <Image width={80} preview={false} src={this.state.images[this.props.status?.toLowerCase()] || success} />
                    <Title level={2} className="text-white mt-16 mb-0 pb-8">{this.state.titles[this.props.status?.toLowerCase()]} </Title>
                    <Text className="text-white">{this.state.messages[this.props.status?.toLowerCase()]}</Text>
                    <div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBORD</Button>
                    </div>
                </div>

            </div>
        )
    }

}
export default CardStatus;