import React, { Component } from 'react';
import { Card, Typography } from 'antd';
import logoColor from "../../assets/images/logo-color.png";
import logoWhite from "../../assets/images/SuisseBase.png";
import Translate from 'react-translate-component';
import { withRouter } from 'react-router-dom';

const { Text,Title, Paragraph } = Typography;
class SbCard extends Component {
    handleClick=()=>{
        this.props.history.push(`/sbcard`)
    }
    render() {
        return (<>
             <Translate content="sb_card_title" component={Title} className="db-titles your-card" />
                <div className='sb-card'>
                    <div className="sb-innercard c-pointer" onClick={this.handleClick}>
                    <div> 
                        <img
                        src={logoWhite}
                        alt="logo"
                        className="tlv-logo light  p-relative p-0 cardlogo-height"
                        onClick={this.routeToHome}
                        />
                    </div>
                <Text className="sb-text">1234 0404 2323 2443</Text>
                </div>
                </div>
        </>);
    }

}
export default withRouter(SbCard);
