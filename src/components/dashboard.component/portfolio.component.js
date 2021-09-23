import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import { fetchGraphInfo, fetchPortfolioData } from '../../reducers/dashboardReducer';
import { createChart, LineStyle } from "lightweight-charts"; //npm install --save lightweight-charts
const rndInt = () => {
    return Math.floor(Math.random() * 150) + 75;
};
let assetColors = [];

class Portfolio extends Component {
    chart;
    state = {
        loading: true,
        info: {}
    }
    portFolioGraphRef = React.createRef();
    async fetchInfo() {
        this.props.dispatch(fetchPortfolioData(this.props.userProfile?.id));

    }
    componentDidMount() {
        this.chart = createChart(this.portFolioGraphRef.current, {
            width: 750, height: 300,
            localization: {
                dateFormat: "dd MMM yy",
            },
            watermark: {
                color: "rgba(11, 94, 29, 0.4)",
                visible: true,
                text:"Portfolio",
                fontSize: 24,
                horzAlign: "left",
                vertAlign: "bottom",
            },
        });
      
        this.fetchInfo();
        this.props.dispatch(fetchGraphInfo(this.props.userProfile?.id, "week"));
        const areaSeries = this.chart.addLineSeries();
        setTimeout(() => {
            areaSeries.setData(this.props.dashboard?.portFolioGraph?.data.BTC);
        
        }, 3000)

    }
    render() {
        const { Title, Paragraph } = Typography;
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;
        const { crypto_stock } = this.props;

        return (
            <div className="mb-24">
                <Translate content="Portfolio_title" component={Title} level={3} className="fs-24 fw-600 mb-0 text-white-30" />
                <div className="portfolio-count py-36 pb-0">
                    <div className="summary-count mr-16">
                        <Currency defaultValue={totalFiatValue} className={`fs-40 m-0 fw-600 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }} />
                        <Currency defaultValue={totalCryptoValue} prefix={""} suffixText={"BTC"} className={`text-white-30 fs-16 m-0 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }} />
                    </div>
                    {/* <Button type="primary" className={`mt-16 trade-btn ${totalCryptoValue < 0 ? 'bgred' : 'bggreen'}`}  size="small">{crypto_stock} {totalCryptoValue < 0 ? <span className="icon sm downarrow-white ml-4" />:<span className="icon sm uparrow-white ml-4" />}</Button> */}
                </div>
                {/* <img src={chart} width="100%" /> */}
                <div ref={this.portFolioGraphRef} />
            </div>
        );
    }
}

export default connectStateProps(Portfolio);