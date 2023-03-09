import React, { Component } from "react";
import {
  Image, Typography,
  Button,
  Row,
  Col,
  Alert,
} from "antd";
import card from "../../assets/images/card.png";
import { getStaus, setStaus } from "./cardsReducer";
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
    const respose = await applyCard();
    this.setState({ loading: false });
    this.props.dispatch(setStaus({ loading: false, status: respose.data }));
  }
  render() {
    const { status: { cardStatus, cardURL }, loading, error } = this.props?.cardsStore;
    const { isBusiness } = this.props.userProfile;
    if (!isBusiness) {
      return <div className="text-center submission-sec">
        <Title level={2} className="text-white">You do not have access to this page </Title>
        <div className="my-25 text-textDark"><Button onClick={() => this.props.history.push("/cockpit")} type="primary" className="mt-36 pop-btn text-textDark">BACK TO COCKPIT</Button>
        </div>
      </div>
    }
    if (cardURL) {
      if (cardURL.startsWith("http") || cardURL.startsWith("https"))
        window.open(cardURL, "_blank");
      else
        window.open(`https://${cardURL}`, "_blank");
      return <Redirect to={"/"} />
    }

    return (
      <div className="main-container mt-36">
        {error != null && <Alert type="error" showIcon closable={false} message={error} />}
        {loading && <Loader />}
        {!loading && !cardStatus && <Row>
          <Col span={12}>
          <Title level={2} className="mb-8 m-0 fw-600 text-white">Suissebase Corporate Expense Card</Title>
            <Title level={3} className="fw-600 mt-4 mb-16 text-white" style={{fontSize:'24px'}}>A card you control</Title>
            <Text className="text-white-30">Powered by Mastercard, a global pioneer in payment innovation and technology connecting billions of consumers, issuers, merchants, governments & businesses worldwide.</Text>

            <Title level={3} className="mb-8 fw-600 text-white">The card offers a myriad range of features:</Title>
            <Text className="text-white-30"><span className="mr-4">-</span> Top up and manage your corporate’s debit card all through the Suissebase platform</Text><br />
            <Text className="text-white-30"><span className="mr-4">-</span> Issue your employees physical and virtual cards for secure local and international payments</Text><br />
            <Text className="text-white-30"><span className="mr-4">-</span> Stay in control of the card’s security all with a tap of your fingers</Text>
            <div className="d-flex mt-24">
              <Button loading={this.state.loading} type="primary" className="pop-btn text-textDark px-36" onClick={() => this.applyCard()}>Apply Now</Button>
            </div>
          </Col>
          <Col span={12}>
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