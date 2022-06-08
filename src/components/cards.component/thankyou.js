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
            <Title className="text-white" level={2}>Your Suisse Card Application Is Successfully Completed</Title>
            <Text className="text-white">Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.Introducing The SuisseBase Rewards Visa® Signature Credit Card. The World's First Rewards Credit Card.</Text>
                    <div className="my-25"><Button type="primary" className="pop-btn text-textDark">BACK TO DASHBORD</Button>
					</div>
          </div>
          </div>
        )
    }

}
export default Cards1;