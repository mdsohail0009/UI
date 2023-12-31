import React, { Component } from 'react';
import { Typography,Button } from 'antd';
import Translate from 'react-translate-component';
import { withRouter } from 'react-router-dom';
import masterCard from '../../assets/images/mastercard.png';

const {Title, Text } = Typography;
class SbCard extends Component {
    handleApplyCard=()=>{
        window.open(process.env.REACT_APP_ACCOUNT_APPLY_CARD, '_blank')
    }
    render() {
        return (<>
             <Translate content="sb_card_title" component={Title} className="db-titles your-card" />
                <div className='sb-card'>
                   
                <div className="card-text-style"><Text>Debit</Text></div>
                    <div className="sb-innercard">
                       
                    <div className='cust-card-btn'> 
                    
                    <Button
                          type="primary"
                          className="custom-btn prime"
                          style={{width:'140px'}}
                          onClick={this.handleApplyCard}
                        >
                          Apply For A Card
                        </Button>
                    </div>
                  
                </div>
                <div className="card-bottom-style d-flex  justify-content"><Text>World Elite</Text>
                <div>
                <img src={masterCard} alt={"masterCard"} />
                <p className='text-center lg-fontsize text-white master-text fw-600'>mastercard</p>
                </div>
                </div>
                </div>
                
        </>);
    }

}
export default withRouter(SbCard);
