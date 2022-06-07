import React, { Component } from "react";
import {
  Form, Image,Typography,
  Button,
  Row,
  Col,
} from "antd";
import card from "../../assets/images/card.png";
const { Title,Text } = Typography;

// thankYou = () =>{
// this.props.history.push("/thankyou");
// }

class NewCards extends Component {
    render() {
      
        return (
          <div className="main-container mt-36">
          <Row>
            <Col span={10}>
                <Title level={3} className="fs-24 fw-600 mb-0 text-white px-4">New Card</Title>
                <Title level={2} className="mt-0 fw-600 text-white px-4">Suisse Card</Title>
                <Text className="text-white">Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.</Text>
                <div className="d-flex mt-24">
                    <Button type="primary" className="pop-btn text-textDark" onClick={this.thankYou}>Apply Now</Button>
                    <Button type="primary" className="btn-back ml-16">Back</Button>
                </div>
            </Col>
            <Col span={14}>
            <Image preview={false}
                src={card}
                />
            </Col>
          </Row>
          </div>
        )
    }

}
export default NewCards;