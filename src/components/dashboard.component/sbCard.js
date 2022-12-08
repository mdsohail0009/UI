import React, { Component } from 'react';
import { Card, Typography } from 'antd';
import logoWhite from "../../assets/images/logo-white.png";
import logoColor from "../../assets/images/logo-color.png";
import Translate from 'react-translate-component';

const { Text,Title, Paragraph } = Typography;
class SbCard extends Component {

    render() {
        return (<>
             <Translate content="sb_card_title" component={Title} className="db-titles" />
                <div className='sb-card'>
                    <div> 
                        <img
                        src={logoWhite}
                        alt="logo"
                        className="tlv-logo light c-pointer p-relative p-0 cardlogo-height"
                        onClick={this.routeToHome}
                        />
                    </div>
                <Text className="sb-text">1234 0404 2323 2443</Text>
                </div>
        </>);
    }

}
export default SbCard;