import React, { Component } from "react";
import {
  Image, Typography,
  Button,
  Row,
  Col,
  Alert,
} from "antd";
import card from "../../assets/images/card.png";
import { getStaus } from "./cardsReducer";
import ConnectStateProps from "../../utils/state.connect";
import Loader from "../../Shared/loader";
import CardStatus from "./thankyou";
import { Redirect } from 'react-router-dom'
import { applyCard } from "./api";
import { setHeaderTab } from "../../reducers/buysellReducer";
const { Title, Text } = Typography;
class NewCards extends Component {
  state = {
    loading: false
  }
  componentDidMount() {
    this.props.dispatch(getStaus(this.props.userProfile?.id));
  }
  componentWillUnmount() {
    this.props.dispatch(setHeaderTab(''));
  }
  async applyCard() {
    this.setState({ loading: true });
    await applyCard(this.props.userProfile?.id);
    this.setState({ loading: false });

    this.props.dispatch(getStaus(this.props.userProfile?.id));
  }
  render() {
    const { status: { cardStatus, cardURL }, loading, error } = this.props?.cardsStore;
    if (cardURL) {
      window.open(cardURL, "_blank");
      return <Redirect to={"/"} />
    }

    return (
      <div className="main-container mt-36">
        {error != null && <Alert type="error" showIcon closable={false} message={error} />}
        {loading && <Loader />}
        {!loading && !cardStatus && <Row>
          <Col span={10}>
            <Title level={3} className="fs-24 fw-600 mb-0 text-white px-4">New Card</Title>
            <Title level={2} className="mb-8 m-0 fw-600 text-white px-4">Suisse Card</Title>
<Text className="text-white">Change “New Card” to “A card you control” and bring it below “Suisse Card”</Text>
            <Text className="text-white"> Change “Suisse Card” to “Suissebase Corporate Expense Card”</Text>
            <Text className="text-white"> Change “Introducing…..Credit Card” to “Powered by Mastercard, a global pioneer in payment innovation and technology connecting billions of consumers, issuers, merchants, governments & businesses worldwide.”</Text>
            
            <Title level={3} className="mb-8 fw-600 text-white px-4">The card offers a myriad range of features:</Title>
            <Text className="text-white">Top up and manage your corporate’s debit card all through the Suissebase platform</Text>
            <Text className="text-white">Issue your employees physical and virtual cards for secure local and international payments</Text>
            <Text className="text-white">Stay in control of the card’s security all with a tap of your fingers</Text>
            <div className="d-flex mt-24">
              <Button loading={this.state.loading} type="primary" className="pop-btn text-textDark" onClick={() => this.applyCard()}>Apply Now</Button>
              {/* <Button type="primary" className="btn-back ml-16">Back</Button> */}
            </div>
          </Col>
          <Col span={14}>
            <Image preview={false}
              src={card}
            />
          </Col>
        </Row>}
        {!loading && cardStatus && <CardStatus onBack={() => {
          this.props.dispatch(setHeaderTab(''));
          this.props.history.push("/cockpit");
        }} status={cardStatus} />}
      </div>
    )
  }

}
export default ConnectStateProps(NewCards);