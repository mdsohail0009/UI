import React, { Component } from "react";
import { Image, Typography, Button } from "antd";
import success from "../../assets/images/success.png";
import pending from "../../assets/images/pending.png";
import reject from "../../assets/images/reject.png";
const { Title, Text } = Typography;

class CardStatus extends Component {
    state = {
        images: {
            inprogress: "",
            rejected: ""
        },
        messages: {
            inprogress: `Your application is In-Progress. you will receive an confirmation email on successful approval.`,
            rejected: "Your application has been rejected. Please contact admin for further information."
        }
    }
    render() {
        return (
            <div className="main-container mt-36">
                <div className="text-center submission-sec">
                    {/* <Image width={80} preview={false} src={pending} />
                    <Image width={80} preview={false} src={reject} /> */}
                    <Image width={80} preview={false} src={this.state.images[this.props.status?.toLowerCase()] || success} />
                    <Title level={2} className="text-white mt-24">{this.state.messages[this.props.status?.toLowerCase()]} </Title>
                    <Text className="text-white">Change “Your Suisse… Completed” to “Application for Suissebase Corporate Expense Card Is Approved”</Text>
                    <Text className="text-white">Change “Back to dashboard” to “Let’s get started”</Text>
                    <Text className="text-white">Your application for the Corporate Expense Card has been successful. To access the admin dashboard for the cards portal, please navigate to the Cards tab above. You should have received an email with the card’s admin credential and further instructions on navigating your way to the platform.</Text>
                    <div className="my-25"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBORD</Button>
                    </div>
                </div>
{/* For Pending */}
                {/* <div className="text-center submission-sec">
                    <Image width={80} preview={false} src={pending} />
                    <Title level={2} className="text-white"> </Title>
                    <Text className="text-white">Application for Suissebase Corporate Expense Card Is Under Review</Text>
                    <div className="my-25 text-textDark"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBORD</Button>
                    </div>
                </div> */}
{/* For Reject */}
                {/* <div className="text-center submission-sec">
                    <Image width={80} preview={false} src={reject} />
                    <Title level={2} className="text-white"> </Title>
                    <Text className="text-white">Approved cancel, Please contact admin</Text>
                    <div className="my-25 text-textDark"><Button onClick={() => this.props.onBack()} type="primary" className="mt-36 pop-btn text-textDark">BACK TO DASHBORD</Button>
                    </div>
                </div> */}
            </div>
        )
    }

}
export default CardStatus;