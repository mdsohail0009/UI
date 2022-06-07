import React, { Component } from "react";
import { Image, Typography, Button } from "antd";
import success from "../../assets/images/success.png";
const { Title, Text } = Typography;

class CardStatus extends Component {
    state = {
        images: {
            inprogress: "",
            rejected: ""
        },
        messages: {
            inprogress: `Your application is In-Progress. you will receive an confirmation email on successfull approval.`,
            rejected: "Your application has been rejected. Please contact admin for further information."
        }
    }
    render() {
        return (
            <div className="main-container mt-36">
                <div className="text-center submission-sec">
                    <Image width={80} preview={false} src={this.state.images[this.props.status?.toLowerCase()] || success} />
                    <Title level={2}>{this.state.messages[this.props.status?.toLowerCase()]} </Title>
                    <Text>Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.</Text>
                    <div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="primary-btn">BACK TO DASHBORD</Button>
                    </div>
                </div>
            </div>
        )
    }

}
export default CardStatus;