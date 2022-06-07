import React, { Component } from "react";
import {
  Image, Typography,
  Button,
  Row,
  Col,
} from "antd";
import card from "../../assets/images/card.png";
import ConnectStateProps from "../../utils/state.connect";
import { getStaus } from "./cardsReducer";
const { Title, Text } = Typography;
class RewardCard extends Component {
  componentDidMount() {
      this.props.dispatch(getStaus(this.props.userProfile.id));
  }

  thankYou = () => {
    this.props.history.push("/rewardcardstatus");
  }
  render() {

    return (
      <>
        <Row>
          <Col span={10}>
            <Title level={3}>New Card</Title>
            <Title level={2} className="mt-0">Suisse Card</Title>
            <Text>Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.</Text>
            <div className="d-flex mt-24">
              <Button type="primary" className="primary-btn" onClick={this.thankYou}>Apply Now</Button>
              <Button type="primary" className="primary-btn cancel-btn ml-8">Back</Button>
            </div>
          </Col>
          <Col span={14}>
            <Image
              src={card}
            />
          </Col>
        </Row>
      </>
    )
  }

}
export default ConnectStateProps(RewardCard);