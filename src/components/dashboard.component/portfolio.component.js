import React, { Component } from 'react';
import { Typography, Button, Radio } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import { fetchGraphInfo, fetchPortfolioData } from '../../reducers/dashboardReducer';
import { createChart, LineStyle, ColorType, PriceScaleMode } from "lightweight-charts";
import { getPortfolioGraph } from './api';
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
                color: "#FFFFFF",
                visible: false,
                text: "Portfolio",
                fontSize: 24,
                horzAlign: "left",
                vertAlign: "bottom",
            },
        });
        this.chart.applyOptions({
            priceScale: { position: "left", mode: PriceScaleMode.Normal },
            crosshair: {
                vertLine: {
                    color: '#FFDB1A',
                    width: 0.5,
                    style: 1,
                    visible: true,
                    labelVisible: false,
                },
                horzLine: {
                    color: '#FFDB1A',
                    width: 0.5,
                    style: 0,
                    visible: true,
                    labelVisible: true,
                },
                mode: 1,
            },
            layout: {
                background: {
                    type: ColorType.VerticalGradient,
                    topColor: 'transparent',
                    bottomColor: 'transparent',
                },
                textColor: '#9797AA',
                fontSize: 12,
                fontFamily: 'Calibri',
            },
            grid: {
                vertLines: {
                    color: '#CECECE',
                    style: 1,
                    visible: false,
                },
                horzLines: {
                    color: '#CECECE',
                    style: 1,
                    visible: false,
                },
            },
            handleScroll: {
                mouseWheel: false,
                pressedMouseMove: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: false,
                pinch: true,
            },
        })
        this.fetchInfo();
        this.getGraph("week");
    }
    getGraph = async (type) => {
        const areaSeries = this.chart.addLineSeries();
        const priceSeries = this.chart.addAreaSeries();
        const response = await getPortfolioGraph(this.props.userProfile?.id, type);
        if (response.ok) {
            const data = { BTC: response.data.map(item => { return { time: item.datetime, value: item.value } }) }
            areaSeries.setData(data.BTC);
            priceSeries.setData(data.BTC);
            this.chart.timeScale().setVisibleLogicalRange({
                from: 0,
                to: data.BTC.length,
            });
        }
    }
    render() {
        const { Title } = Typography;
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;

        return (
            <div className="mb-24">
                <Translate content="Portfolio_title" component={Title} level={3} className="fs-24 fw-600 mb-0 text-white-30" />
                <div className="portfolio-count py-36">
                    <div className="summary-count mr-16">
                        <Currency defaultValue={totalFiatValue} className={`fs-40 m-0 fw-600 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }} />
                        <Currency defaultValue={totalCryptoValue} prefix={""} suffixText={"BTC"} className={`text-white-30 fs-16 m-0 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }} />
                    </div>
                    {/* <Button type="primary" className={`mt-16 trade-btn ${totalCryptoValue < 0 ? 'bgred' : 'bggreen'}`}  size="small">{crypto_stock} {totalCryptoValue < 0 ? <span className="icon sm downarrow-white ml-4" />:<span className="icon sm uparrow-white ml-4" />}</Button> */}
                </div>
                {/* <img src={chart} width="100%" /> */}
                <div className="text-center mb-16 wmy-graph" >
                    <Radio.Group defaultValue="week" buttonStyle="solid" onChange={({target:{value}}) => {
                       this.getGraph(value)
                    }}>
                        <Radio.Button value="week">1W</Radio.Button>
                        <Radio.Button value="month">1M</Radio.Button>
                        <Radio.Button value="year">1Y</Radio.Button>
                    </Radio.Group>
                </div>
                <div ref={this.portFolioGraphRef} />
            </div>
        );
    }
}

export default connectStateProps(Portfolio);