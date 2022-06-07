import React, { Component } from "react";
import {Image,Typography, Button} from "antd";
import success from "../../assets/images/success.png";
const { Title,Text } = Typography;

class Cards1 extends Component {
    render() {
      
        return (
            <div className="main-container mt-36">
            <div className="text-center submission-sec">
          
            <Image width={80} preview={false} src={success} />
            <Title level={2}>Your Suisse Card Application Is Successfully Completed</Title>
            <Text>Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.</Text>
                    <div className="my-25"><Button type="primary" className="primary-btn">BACK TO DASHBORD</Button>
					</div>
          </div>
          </div>
        )
    }

}
export default Cards1;