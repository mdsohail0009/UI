import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import Translate from 'react-translate-component';
import chart from '../../assets/images/chart.png';
import { fetchPortfolio } from './api';
import connectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';

class Portfolio extends Component {
    state = {
        loading: true,
        info: {}
    }
    async fetchInfo() {
     const response = await fetchPortfolio(this.props.userProfile?.id);
     if(response.ok){
         this.setState({...this.state,loading:false,info:response.data});
     }else{
        this.setState({...this.state,loading:false,info:{},error:response.data});
     }
    }
    componentDidMount(){
        this.fetchInfo();
    }
    render() {
        const { Title, Paragraph } = Typography;
        const { totalCryptoValue,totalFiatValue } = this.state.info;
        const {crypto_stock} =this.props;

        return (
            <div className="mb-24">
                <Translate content="Portfolio_title" component={Title} level={3} className="fs-24 fw-600 mb-0 text-white-30" />
                <div className="portfolio-count py-36 pb-0">
                    <div className="summary-count mr-16">
                        <Currency defaultValue={totalCryptoValue} className={`fs-40 m-0 fw-600 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }}/>
                        <Currency defaultValue={totalFiatValue} prefix={""} suffixText={"BTC"} className={`text-white-30 fs-16 m-0 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }}/>
                    </div>
                   <Button type="primary" className={`mt-16 trade-btn ${totalCryptoValue < 0 ? 'bgred' : 'bggreen'}`}  size="small">{crypto_stock} {totalCryptoValue < 0 ? <span className="icon sm downarrow-white ml-4" />:<span className="icon sm uparrow-white ml-4" />}</Button>
                </div>
                <img src={chart} width="100%" />
            </div>
        );
    }
}

export default connectStateProps(Portfolio);