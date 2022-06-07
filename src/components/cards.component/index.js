import React, { Component } from "react";
import {
  Form, Image,Typography,Checkbox,
  Button,
  Row,
  Col,
} from "antd";
import Translate from "react-translate-component";
import { Link } from "react-router-dom";
import card from "../../assets/images/card.png";
import apiCalls from "../../api/apiCalls";

const { Title,Text,Paragraph } = Typography;

// thankYou = () =>{
// this.props.history.push("/thankyou");
// }

class NewCards extends Component {
    render() {
        const link = <this.LinkValue content="terms_Use" />;
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
                {/* <Form>
                <Form.Item
                    className="custom-forminput mb-36 agree"
                    name="isAccept"
                    valuePropName="checked"
                    required
                    rules={[
                        {
                          validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error(apiCalls.convertLocalLang('agree_to_signup')
                            )),
                        },
                      ]}
                   
                  >
                    <span className="d-flex">
                      <Checkbox className="ant-custumcheck" />
                      <span className="withdraw-check"></span>
                      <Translate
                        content="agree_to_signup"
                        with={{ link }}
                        component={Paragraph}
                        className="fs-14 text-white-30 ml-16 mb-4"
                        style={{ flex: 1 }}
                      />
                    </span>
                  </Form.Item></Form> */}
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