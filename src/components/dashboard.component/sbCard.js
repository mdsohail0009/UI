import React, { Component } from 'react';
import { Typography,Button } from 'antd';
import Translate from 'react-translate-component';
import { withRouter } from 'react-router-dom';

const {Title } = Typography;
class SbCard extends Component {
    handleApplyCard=()=>{
        window.open(process.env.REACT_APP_ACCOUNT_USER_ONBOARD, '_blank')
    }
    render() {
        return (<>
             <Translate content="sb_card_title" component={Title} className="db-titles your-card" />
                <div className='sb-card'>
                    <div className="sb-innercard">
                    <div> 
                    
                    <Button
                          type="primary"
                          className="custom-btn prime"
                          style={{width:'118px'}}
                          onClick={this.handleApplyCard}
                        >
                          Apply Card
                        </Button>
                    </div>
                  
                </div>
                </div>
        </>);
    }

}
export default withRouter(SbCard);
